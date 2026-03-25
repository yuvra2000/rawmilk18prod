import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ColDef, GridApi } from 'ag-grid-community';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
  includeHeaders?: boolean;
  onlySelected?: boolean;
  onlyVisible?: boolean;
  customTitle?: string;
  addTimestamp?: boolean;
  autoFilterHeaders?: boolean;
  freezeHeaderRow?: boolean;
  columnWidthMultiplier?: number;
}

export interface ExcelStyleOptions {
  headerBackgroundColor?: string;
  headerFontColor?: string;
  headerFontBold?: boolean;
  alternateRowColors?: boolean;
  borderStyle?: 'thin' | 'medium' | 'thick';
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  /**
   * Export AG Grid data to Excel with advanced features
   */
  exportToExcel(
    gridApi:GridApi,
    columns: ColDef[],
    options: ExcelExportOptions = {},
    styleOptions: ExcelStyleOptions = {}
  ): void {
    try {
      // Set default options
      const exportOptions = {
        fileName: 'grid-export.xlsx',
        sheetName: 'Sheet1',
        includeHeaders: true,
        onlySelected: false,
        onlyVisible: true,
        addTimestamp: true,
        autoFilterHeaders: true,
        freezeHeaderRow: true,
        columnWidthMultiplier: 1.2,
        ...options
      };

      const styleOpts = {
        headerBackgroundColor: '#4472C4',
        headerFontColor: '#FFFFFF',
        headerFontBold: true,
        alternateRowColors: true,
        borderStyle: 'thin' as const,
        ...styleOptions
      };

      // Filter exportable columns
      const exportableColumns = this.getExportableColumns(columns);
      
      if (exportableColumns.length === 0) {
        console.warn('No exportable columns found');
        return;
      }

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheetData = this.prepareWorksheetData(gridApi, exportableColumns, exportOptions);
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply styling and formatting
      this.applyWorksheetStyling(worksheet, exportableColumns, worksheetData, styleOpts);
      this.setColumnWidths(worksheet, exportableColumns, exportOptions.columnWidthMultiplier!);
      
      if (exportOptions.autoFilterHeaders) {
        this.addAutoFilter(worksheet, exportableColumns.length, worksheetData.length);
      }

      if (exportOptions.freezeHeaderRow && exportOptions.includeHeaders) {
        this.freezeHeaderRow(worksheet);
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, exportOptions.sheetName);

      // Add metadata
      this.addWorkbookMetadata(workbook, exportOptions);

      // Generate filename with timestamp if requested
      const fileName = this.generateFileName(exportOptions.fileName!, exportOptions.addTimestamp!);

      // Export file
      XLSX.writeFile(workbook, fileName);

      console.log(`Excel file exported successfully: ${fileName}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export Excel file');
    }
  }

  /**
   * Export multiple sheets in one workbook
   */
  exportMultipleSheets(
    sheets: Array<{
      gridApi: GridApi;
      columns: ColDef[];
      sheetName: string;
      options?: ExcelExportOptions;
    }>,
    fileName: string = 'multi-sheet-export.xlsx'
  ): void {
    const workbook = XLSX.utils.book_new();

    sheets.forEach((sheet, index) => {
      const exportableColumns = this.getExportableColumns(sheet.columns);
      const worksheetData = this.prepareWorksheetData(
        sheet.gridApi,
        exportableColumns,
        { includeHeaders: true, ...sheet.options }
      );
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply basic styling
      this.setColumnWidths(worksheet, exportableColumns, 1.2);
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });

    this.addWorkbookMetadata(workbook, { fileName });
    XLSX.writeFile(workbook, fileName);
  }

  private getExportableColumns(columns: ColDef[]): ColDef[] {
    return columns.filter(col => 
      col.field && 
      (col as any).exportable !== false && 
      col.hide !== true
    );
  }

  private prepareWorksheetData(
     gridApi:GridApi, 
    columns: ColDef[], 
    options: ExcelExportOptions
  ): any[][] {
    const worksheetData: any[][] = [];

    // Add title if specified
    if (options.customTitle) {
      worksheetData.push([options.customTitle]);
      worksheetData.push([]); // Empty row
    }

    // Add headers
    if (options.includeHeaders) {
      const headers = columns.map(col => col.headerName || col.field || '');
      worksheetData.push(headers);
    }

// 4. Add MAIN Data Rows (Existing Logic)
    gridApi.forEachNodeAfterFilterAndSort(node => {
      worksheetData.push(this.processRowNode(node, columns, gridApi));
    });

  // 5. Add Pinned BOTTOM Rows (Yeh aapko chahiye tha)
    const pinnedBottomCount = gridApi.getPinnedBottomRowCount();
    for (let i = 0; i < pinnedBottomCount; i++) {
      const node = gridApi.getPinnedBottomRow(i);
      if (node) {
        worksheetData.push(this.processRowNode(node, columns, gridApi));
      }
    }
  

    
    return worksheetData;
  }
// Helper to process a single row node (Used for Main, Pinned Top, and Pinned Bottom)
  private processRowNode(node: any, columns: ColDef[], gridApi: GridApi): any[] {
    return columns.map(col => {
      let value: any;

      // ========================= FINAL AUR CORRECT LOGIC (Reusable) =========================

      // Step 1: Check valueGetter
      if (col.valueGetter && typeof col.valueGetter === 'function') {
        value = col.valueGetter({
          data: node.data,
          node: node,
          colDef: col,
          api: gridApi,
          getValue: (field: any) => node.data[field],
          // context: gridApi.gridOptionsWrapper.context // (Optional context if needed)
        } as any);
      } else {
        // Direct field access
        value = node.data ? node.data[col.field!] : undefined;
      }

      // Step 2: Value Formatter
      if (col.valueFormatter && typeof col.valueFormatter === 'function' && (col as any).useValueFormatterForExport !== false) {
        value = col.valueFormatter({
          value,
          data: node.data,
          node,
          colDef: col,
          api: gridApi
        } as any);
      }

    const isDateTime = col.cellDataType === 'dateTimeString';
    const formattedValue = this.formatCellValue(value, col);

    // 🔥 MASTER FIX: Hierarchy ke liye Date Object pass karein aur 't: d' rakhein
if (isDateTime && typeof formattedValue === 'number') {
      return { 
        v: formattedValue, 
        t: 'n', // Excel isey number ki tarah lega (No drift)
        z: 'yyyy-mm-dd hh:mm:ss' // Par display aur hierarchy Date wali dega
      };
    }
    return formattedValue
    });
  }
private formatCellValue(value: any, column: ColDef): any {
  if (value == null || value === '') return '';

  const isDateTime = column.cellDataType === 'dateTimeString';

  if (isDateTime) {
    let dateStr = String(value);
    const parts = dateStr.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    
    if (parts) {
      const year = parseInt(parts[1]);
      const month = parseInt(parts[2]);
      const day = parseInt(parts[3]);
      const hour = parseInt(parts[4]);
      const min = parseInt(parts[5]);
      const sec = parseInt(parts[6]);

      // 🔥 DRIFT FIX: Date.UTC use karein taaki local timezone history ignore ho jaye
      const utcDate = Date.UTC(year, month - 1, day, hour, min, sec);
      const utcEpoch = Date.UTC(1899, 11, 30); // Excel Epoch in UTC
      
      // Serial number calculation (No drift)
      return (utcDate - utcEpoch) / 86400000; 
    }
  }

  // Agar already Date object hai (from grid)
  if (value instanceof Date) return value;

    // Handle numbers
    if (typeof value === 'number') {
      return value;
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Handle objects/arrays
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }

private applyWorksheetStyling(
  worksheet: XLSX.WorkSheet, 
  columns: ColDef[], 
  worksheetData: any[][], 
  styleOptions: ExcelStyleOptions
): void {
  if (!worksheet['!ref']) {
    console.warn('Worksheet ref not found');
    return;
  }

  // Correct header row detection
  let headerRowIndex = 0;
  
  // Check if first row is a custom title (single cell with string)
//   if (worksheetData[0] && worksheetData[0].length === 1 && typeof worksheetData === 'string') {
//     headerRowIndex = 2; // Title at 0, empty row at 1, headers at 2
//   }
  if (worksheetData[0]?.length === 1 && worksheetData[1]?.length === 0) {
    headerRowIndex = 2;
  }
  // Apply header styling to each header cell
  for (let col = 0; col < columns.length; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
    
    // Ensure cell exists
    if (!worksheet[cellAddress]) {
      continue; // Skip if cell doesn't exist
    }
    
    // Apply styling
    worksheet[cellAddress].s = {
      font: {
        bold: true, // ✅ Force bold
        color: { rgb: styleOptions.headerFontColor?.replace('#', '') || 'FFFFFF' },
        sz: 12,
        name: 'Calibri'
      },
      fill: {
        fgColor: { rgb: styleOptions.headerBackgroundColor?.replace('#', '') || '4472C4' }
      },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      }
    };
  }
}


  private setColumnWidths(
    worksheet: XLSX.WorkSheet, 
    columns: ColDef[], 
    multiplier: number
  ): void {
    const colWidths = columns.map(col => {
      const headerLength = (col.headerName || col.field || '').length;
      const baseWidth = Math.max(headerLength, 10);
      return { wch: baseWidth * multiplier };
    });

    worksheet['!cols'] = colWidths;
  }

  private addAutoFilter(worksheet: XLSX.WorkSheet, columnCount: number, rowCount: number): void {
    if (rowCount > 1) {
      worksheet['!autofilter'] = {
        ref: `A1:${XLSX.utils.encode_col(columnCount - 1)}1`
      };
    }
  }

  private freezeHeaderRow(worksheet: XLSX.WorkSheet): void {
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  }

  private addWorkbookMetadata(workbook: XLSX.WorkBook, options: ExcelExportOptions): void {
    workbook.Props = {
      Title: options.customTitle || 'AG Grid Export',
      Subject: 'Data Export',
      Author: 'AG Grid Excel Export Service',
      CreatedDate: new Date()
    };
  }

  private generateFileName(baseName: string, addTimestamp: boolean): string {
    if (!addTimestamp) return baseName;

    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '_');
    
    const nameWithoutExt = baseName.replace(/\.xlsx?$/i, '');
    return `${nameWithoutExt}_${timestamp}.xlsx`;
  }

  /**
   * Validate data before export
   */
  validateExportData(data: any[], columns: ColDef[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data || data.length === 0) {
      errors.push('No data available for export');
    }

    if (!columns || columns.length === 0) {
      errors.push('No columns defined for export');
    }

    const exportableColumns = this.getExportableColumns(columns);
    if (exportableColumns.length === 0) {
      errors.push('No exportable columns found');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
//   async exportLargeDataset(gridApi:GridApi, columns: ColDef[], fileName = 'large-export.xlsx'): Promise<void> {
//   const workbook = XLSX.utils.book_new();

//   for (let i = 0; i < dataChunks.length; i++) {
//     const chunk = dataChunks[i];
    
//     // Prepare worksheet data (reuse your existing method to create header + rows)
//     const worksheetData = this.prepareWorksheetData(gridApi, columns, { includeHeaders: true });
//     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

//     // Apply basic styling & column widths if desired
//     this.setColumnWidths(worksheet, columns, 1.2);

//     // Append sheet with index in name to differentiate
//     XLSX.utils.book_append_sheet(workbook, worksheet, `Part ${i + 1}`);
//   }

//   // Add metadata (optional)
//   workbook.Props = {
//     Title: 'Large Export',
//     Author: 'Your App Name',
//     CreatedDate: new Date()
//   };

//   XLSX.writeFile(workbook, fileName);
// }

}
