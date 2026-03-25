
import { Injectable, signal, computed } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import the function
import { ColDef, GridApi } from 'ag-grid-community';
import { GridColumnConfig } from '../ag-grid.component';

// Interfaces for PDF service
export interface PdfExportOptions {
  startY?: number;
  fileName?: string;
  title?: string;
  subtitle?: string;
  includeHeaders?: boolean;
  includeFooters?: boolean;
  onlyVisible?: boolean;
  onlySelected?: boolean;
  customTitle?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter' | 'legal';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  addTimestamp?: boolean;
  addPageNumbers?: boolean;
  customStyles?: PdfStyleOptions;
  watermark?: string;
  logo?: {
    src: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  columnOptions?: {
    [key: string]: {
      width?: number;
      align?: 'left' | 'center' | 'right';
      fontSize?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      textColor?: string;
      fillColor?: string;
    };
  };
}

export interface PdfStyleOptions {
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  headerFontSize?: number;
  headerTextColor?: string;
  headerBackgroundColor?: string;
  alternateRowColors?: boolean;
  borderStyle?: 'thin' | 'medium' | 'thick';
  borderColor?: string;
  cellPadding?: number;
  tableWidth?: 'auto' | 'wrap';
  theme?: 'striped' | 'grid' | 'plain' | 'custom';
}

export interface PdfValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PdfProgressInfo {
  stage: 'preparing' | 'processing' | 'generating' | 'complete';
  progress: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  // Signal-based state management (Angular 18 best practice)
  private readonly exportProgress = signal<PdfProgressInfo>({
    stage: 'preparing',
    progress: 0,
    message: 'Initializing export...'
  });

  private readonly isExporting = signal(false);

  // Computed signals for reactive state
  readonly progress = computed(() => this.exportProgress());
  readonly exporting = computed(() => this.isExporting());

  private defaultOptions: PdfExportOptions = {
    fileName: 'grid-export.pdf',
    title: 'Data Export',
    includeHeaders: true,
    includeFooters: true,
    onlyVisible: true,
    onlySelected: false,
    orientation: 'landscape',
    pageSize: 'a4',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    addTimestamp: true,
    addPageNumbers: true,
    customStyles: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      textColor: '#1f2937',
      fontSize: 10,
      fontFamily: 'helvetica',
      headerFontSize: 12,
      headerTextColor: '#ffffff',
      headerBackgroundColor: '#2563eb',
      alternateRowColors: true,
      borderStyle: 'thin',
      borderColor: '#d1d5db',
      cellPadding: 8,
      tableWidth: 'auto',
      theme: 'grid'
    }
  };

  /**
   * Main export method - Entry point for PDF generation
   */
  async exportToPdf(
    gridApi: GridApi,
    columns: GridColumnConfig[],
    options: Partial<PdfExportOptions> = {}
  ): Promise<void> {
    try {
      this.isExporting.set(true);
      this.updateProgress('preparing', 5, 'Validating export data...');
       
       
      // Merge options with defaults
      const exportOptions = this.mergeOptions(options);
     
      // Validate export data
      const validation = this.validateExportData(gridApi, columns);
      if (!validation.isValid) {
        throw new Error(`Export validation failed: ${validation.errors.join(', ')}`);
      }
     
      this.updateProgress('processing', 15, 'Processing grid data...');

      // Extract and process data
      const { exportableColumns, processedData } = await this.processGridData(
        gridApi, 
        columns, 
        exportOptions
      );
    // ====================== ADAPTIVE LOGIC STARTS HERE ======================
    const columnCount = exportableColumns.length;

    // 1. Intelligent Font Size
    let tableFontSize = exportOptions.customStyles?.fontSize || 8;
    if (columnCount > 20) tableFontSize = 5;
    else if (columnCount > 15) tableFontSize = 6;
    if(exportOptions.customStyles) exportOptions.customStyles.fontSize = tableFontSize;

    // 2. Dynamic Page Layout
    const orientation = columnCount > 12 ? 'landscape' : 'portrait';
    const pageSize = columnCount > 25 ? 'a3' : 'a4';
    exportOptions.orientation = exportOptions.orientation || orientation;
    exportOptions.pageSize = exportOptions.pageSize || pageSize;
    // ======================= ADAPTIVE LOGIC ENDS HERE =======================
      this.updateProgress('generating', 50, 'Generating PDF document...');

      // Create PDF document
      const doc = this.createPdfDocument(exportOptions);
      
      // Add content to PDF
      await this.addContentToPdf(doc, exportableColumns, processedData, exportOptions);

      this.updateProgress('generating', 90, 'Finalizing document...');

      // Generate filename and save
      const fileName = this.generateFileName(exportOptions.fileName!, exportOptions.addTimestamp!);
      doc.save(fileName);

      this.updateProgress('complete', 100, 'Export completed successfully!');
      console.log(`PDF exported successfully: ${fileName}`);

    } catch (error:any) {
      console.error('PDF export failed:', error);
      throw new Error(`PDF export failed: ${error.message}`);
    } finally {
      setTimeout(() => {
        this.isExporting.set(false);
      }, 1000);
    }
  }

  /**
   * Export multiple grids to separate sheets in one PDF
   */
  async exportMultipleGrids(
    grids: Array<{
      gridApi: GridApi;
      columns: GridColumnConfig[];
      title: string;
      options?: Partial<PdfExportOptions>;
    }>,
    fileName: string = 'multi-grid-export.pdf'
  ): Promise<void> {
    try {
      this.isExporting.set(true);
      const doc = new jsPDF('landscape', 'mm', 'a4');

      for (let i = 0; i < grids.length; i++) {
        const grid = grids[i];
        this.updateProgress('processing', (i / grids.length) * 80, `Processing grid ${i + 1} of ${grids.length}...`);

        const options = this.mergeOptions({ ...grid.options, title: grid.title });
        const { exportableColumns, processedData } = await this.processGridData(
          grid.gridApi,
          grid.columns,
          options
        );

        if (i > 0) {
          doc.addPage();
        }

        await this.addContentToPdf(doc, exportableColumns, processedData, options);
      }

      this.updateProgress('generating', 95, 'Saving multi-grid PDF...');
      doc.save(fileName);
      this.updateProgress('complete', 100, 'Multi-grid export completed!');

    } catch (error) {
      console.error('Multi-grid PDF export failed:', error);
      throw error;
    } finally {
      setTimeout(() => {
        this.isExporting.set(false);
      }, 1000);
    }
  }

  /**
   * Create PDF with custom template
   */
  async exportWithTemplate(
    gridApi: GridApi,
    columns: GridColumnConfig[],
    templateConfig: {
      header?: { content: string; height: number; };
      footer?: { content: string; height: number; };
      sections?: Array<{ title: string; content: string; }>;
    },
    options: Partial<PdfExportOptions> = {}
  ): Promise<void> {
    const exportOptions = this.mergeOptions(options);
    const doc = this.createPdfDocument(exportOptions);

    // Add template content
    if (templateConfig.header) {
      this.addTemplateHeader(doc, templateConfig.header);
    }

    const { exportableColumns, processedData } = await this.processGridData(
      gridApi,
      columns,
      exportOptions
    );

    // Calculate starting position after template header
    let startY = templateConfig.header ? templateConfig.header.height + 20 : 40;

    await this.addContentToPdf(doc, exportableColumns, processedData, {
      ...exportOptions,
      startY
    });

    if (templateConfig.footer) {
      this.addTemplateFooter(doc, templateConfig.footer);
    }

    const fileName = this.generateFileName(exportOptions.fileName!, exportOptions.addTimestamp!);
    doc.save(fileName);
  }

  /**
   * Get export preview (returns base64 data URL)
   */
  async getExportPreview(
    gridApi: GridApi,
    columns: GridColumnConfig[],
    options: Partial<PdfExportOptions> = {}
  ): Promise<string> {
    const exportOptions = this.mergeOptions(options);
    const doc = this.createPdfDocument(exportOptions);

    const { exportableColumns, processedData } = await this.processGridData(
      gridApi,
      columns,
      exportOptions
    );

    await this.addContentToPdf(doc, exportableColumns, processedData, exportOptions);

    return doc.output('datauristring');
  }

  // Private helper methods

  private updateProgress(stage: PdfProgressInfo['stage'], progress: number, message: string): void {
    this.exportProgress.set({ stage, progress, message });
  }

  private mergeOptions(options: Partial<PdfExportOptions>): PdfExportOptions {
    return {
      ...this.defaultOptions,
      ...options,
      customStyles: {
        ...this.defaultOptions.customStyles,
        ...options.customStyles
      },
      margins: {
        ...this.defaultOptions.margins,
        ...options.margins
      }
    };
  }

private validateExportData(gridApi: GridApi, columns: GridColumnConfig[]): PdfValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!gridApi) {
    errors.push('Grid API is not available');
  }

  if (!columns || columns.length === 0) {
    errors.push('No columns available for export');
  }

  const exportableColumns = columns.filter(col => 
    col.field && col.exportable !== false && !col.hide
  );

  if (exportableColumns.length === 0) {
    errors.push('No exportable columns found');
  }

  // ====================== THE OPTIMIZED SOLUTION ======================
  // Loop ki koi zaroorat nahi hai. Seedhe grid se poochein.
  const hasData = gridApi.getDisplayedRowCount() > 0;
  
  if (!hasData) {
    warnings.push('No data rows found to export');
  }
  // ====================================================================

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

  private async processGridData(
    gridApi: GridApi,
    columns: GridColumnConfig[],
    options: PdfExportOptions
  ): Promise<{
    exportableColumns: GridColumnConfig[];
    processedData: any[][];
  }> {
    // Filter exportable columns
    const exportableColumns = columns.filter(col =>
      col.field && 
      col.exportable !== false && 
      (!options.onlyVisible || !col.hide)
    );

    // Prepare data
    const processedData: any[][] = [];
  const MAX_HEADER_LENGTH = 25; // Header text ki max length

  // Add headers with truncation
  if (options.includeHeaders) {
    const headers = exportableColumns.map(col => {
      let headerName = col.headerName || this.formatFieldName(col.field!);
      if (headerName.length > MAX_HEADER_LENGTH) {
        return headerName.substring(0, MAX_HEADER_LENGTH - 3) + '...';
      }
      return headerName;
    });
    processedData.push(headers);
  }
    // Add headers if required
    if (options.includeHeaders) {
      const headers = exportableColumns.map(col => 
        col.headerName || this.formatFieldName(col.field!)
      );
      processedData.push(headers);
    }

    // Process data rows
    const rowsToProcess = options.onlySelected 
      ? gridApi.getSelectedRows()
      : this.getAllRowsData(gridApi);

    rowsToProcess.forEach(rowData => {
      const rowForPdf = exportableColumns.map(col => {
        let value = this.getCellValue(rowData, col, gridApi);
        return this.formatCellValue(value, col);
      });
      processedData.push(rowForPdf);
    });

    return { exportableColumns, processedData };
  }

  private getAllRowsData(gridApi: GridApi): any[] {
    const rowData: any[] = [];
    gridApi.forEachNodeAfterFilterAndSort(node => {
      if (node.data) {
        rowData.push(node.data);
      }
    });
    return rowData;
  }

  private getCellValue(rowData: any, column: GridColumnConfig, gridApi: GridApi): any {
    let value: any;

    // Handle value getter
    if (column.valueGetter && typeof column.valueGetter === 'function') {
      value = column.valueGetter({
        data: rowData,
        node: null,
        colDef: column,
        api: gridApi,
        getValue: (field: string) => rowData[field]
      } as any);
    } else {
      value = rowData[column.field!];
    }

    // Apply value formatter if exists
    if (column.valueFormatter && 
        typeof column.valueFormatter === 'function' && 
        column.useValueFormatterForExport !== false) {
      value = column.valueFormatter({
        value,
        data: rowData,
        node: null,
        colDef: column,
        api: gridApi
      } as any);
    }

    return value;
  }

  private formatCellValue(value: any, column: ColDef): string {
    if (value == null || value === undefined) return '';

    // Handle different data types
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === 'number') {
      // Handle numeric formatting based on column type
      if (column.cellDataType === 'number') {
        return value.toLocaleString();
      }
      return value.toString();
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Object]';
      }
    }

    return String(value).trim();
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private createPdfDocument(options: PdfExportOptions): jsPDF {
    return new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.pageSize,
      compress: true
    });
  }

  private async addContentToPdf(
    doc: jsPDF,
    columns: GridColumnConfig[],
    data: any[][],
    options: PdfExportOptions
  ): Promise<void> {
    const styles = options.customStyles!;
    let currentY = options.margins!.top!;

    // Add logo if provided
    if (options.logo) {
      await this.addLogo(doc, options.logo);
      currentY += 30;
    }

    // Add title
    if (options.title) {
      currentY = this.addTitle(doc, options.title, currentY, styles);
    }

    // Add subtitle
    if (options.subtitle) {
      currentY = this.addSubtitle(doc, options.subtitle, currentY, styles);
    }

    // Add timestamp
    if (options.addTimestamp) {
      currentY = this.addTimestamp(doc, currentY, styles);
    }

    // Add watermark
    if (options.watermark) {
      this.addWatermark(doc, options.watermark);
    }

    // Configure table options
    const tableOptions = this.buildAutoTableOptions(columns, data, options, currentY);
       console.log('Table options:', tableOptions);
       
    // Generate table
    autoTable(doc,tableOptions);

    // Add page numbers
    if (options.addPageNumbers) {
      this.addPageNumbers(doc);
    }

    // Add custom footer
    if (options.includeFooters) {
      this.addFooter(doc, styles);
    }
  }

  private addTitle(doc: jsPDF, title: string, y: number, styles: PdfStyleOptions): number {
    doc.setFontSize(styles.headerFontSize! + 4);
    doc.setFont(styles.fontFamily!, 'bold');
    doc.setTextColor(styles.primaryColor!);

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const x = (pageWidth - textWidth) / 2;

    doc.text(title, x, y);
    return y + 15;
  }

  private addSubtitle(doc: jsPDF, subtitle: string, y: number, styles: PdfStyleOptions): number {
    doc.setFontSize(styles.fontSize! + 2);
    doc.setFont(styles.fontFamily!, 'normal');
    doc.setTextColor(styles.secondaryColor!);

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(subtitle);
    const x = (pageWidth - textWidth) / 2;

    doc.text(subtitle, x, y);
    return y + 10;
  }

  private addTimestamp(doc: jsPDF, y: number, styles: PdfStyleOptions): number {
    const timestamp = `Generated on: ${new Date().toLocaleString()}`;
    doc.setFontSize(styles.fontSize!);
    doc.setFont(styles.fontFamily!, 'italic');
    doc.setTextColor(styles.secondaryColor!);

    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(timestamp);
    const x = pageWidth - textWidth - 20;

    doc.text(timestamp, x, y);
    return y + 8;
  }

  private async addLogo(doc: jsPDF, logo: NonNullable<PdfExportOptions['logo']>): Promise<void> {
    try {
      const x = logo.x || 20;
      const y = logo.y || 10;
      doc.addImage(logo.src, 'JPEG', x, y, logo.width, logo.height);
    } catch (error) {
      console.warn('Failed to add logo to PDF:', error);
    }
  }

  private addWatermark(doc: jsPDF, watermark: string): void {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.saveGraphicsState();

      // Set transparency and rotation
      doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

      // Position watermark in center of page
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(50);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(128, 128, 128);

      // Rotate and center text
      const textWidth = doc.getTextWidth(watermark);
      doc.text(watermark, pageWidth / 2 - textWidth / 2, pageHeight / 2, {
        angle: -45
      });

      doc.restoreGraphicsState();
    }
  }

  private buildAutoTableOptions(
    columns: GridColumnConfig[],
    data: any[][],
    options: PdfExportOptions,
    startY: number
  ): any {
    const styles = options.customStyles!;

    // Build column styles
    const columnStyles: any = {};
    columns.forEach((col, index) => {
      const colOption = options.columnOptions?.[col.field!];
      if (colOption) {
        columnStyles[index] = {
          halign: colOption.align || 'left',
          fontSize: colOption.fontSize || styles.fontSize,
          fontStyle: colOption.fontStyle || 'normal',
          textColor: colOption.textColor || styles.textColor,
          fillColor: colOption.fillColor
        };
      }
    });

    return {
      head: options.includeHeaders ? [data[0]] : undefined,
      body: options.includeHeaders ? data.slice(1) : data,
      startY: startY + 5,
      theme: styles.theme === 'custom' ? undefined : styles.theme,
      styles: {
        fontSize: styles.fontSize,
        font: styles.fontFamily,
        textColor: styles.textColor,
        cellPadding: styles.cellPadding,
        lineColor: styles.borderColor,
        lineWidth: styles.borderStyle === 'thin' ? 0.1 : 
                  styles.borderStyle === 'medium' ? 0.3 : 0.5
      },
      headStyles: {
        fillColor: styles.headerBackgroundColor,
        textColor: styles.headerTextColor,
        fontSize: styles.headerFontSize,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: styles.alternateRowColors ? {
        fillColor: [245, 245, 245]
      } : undefined,
      columnStyles,
      tableWidth: styles.tableWidth,
      margin: options.margins,
      didDrawPage: (data: any) => {
        // Custom page drawing logic can be added here
      },
      willDrawCell: (data: any) => {
        // Custom cell drawing logic can be added here
        if (data.row.index === 0) { // Header row
          data.cell.styles.fontStyle = 'bold';
        }
      }
    };
  }

  private addPageNumbers(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);

      const pageText = `Page ${i} of ${pageCount}`;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const textWidth = doc.getTextWidth(pageText);

      doc.text(pageText, pageWidth - textWidth - 20, pageHeight - 10);
    }
  }

  private addFooter(doc: jsPDF, styles: PdfStyleOptions): void {
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(8);
      doc.setTextColor(styles.secondaryColor!);
      doc.text(
        'Generated by Advanced Grid Export Service', 
        20, 
        pageHeight - 5
      );
    }
  }

  private addTemplateHeader(doc: jsPDF, header: { content: string; height: number; }): void {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(header.content, 20, 20);
  }

  private addTemplateFooter(doc: jsPDF, footer: { content: string; height: number; }): void {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(footer.content, 20, pageHeight - footer.height);
  }

  private generateFileName(baseName: string, addTimestamp: boolean): string {
    if (!addTimestamp) return baseName;

    const timestamp = new Date().toISOString()
      .replace(/:/g, '-')
      .replace(/\..+/, '')
      .replace('T', '_');

    const nameWithoutExt = baseName.replace(/\.pdf$/i, '');
    return `${nameWithoutExt}_${timestamp}.pdf`;
  }

  /**
   * Public utility methods
   */

  setGlobalDefaults(options: Partial<PdfExportOptions>): void {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
      customStyles: {
        ...this.defaultOptions.customStyles,
        ...options.customStyles
      }
    };
  }

  getDefaultOptions(): PdfExportOptions {
    return { ...this.defaultOptions };
  }

  resetProgress(): void {
    this.exportProgress.set({
      stage: 'preparing',
      progress: 0,
      message: 'Ready to export...'
    });
  }
}
