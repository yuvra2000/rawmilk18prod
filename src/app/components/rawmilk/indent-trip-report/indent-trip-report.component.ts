import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { indentTripFilterFields, indentTripGridColumns } from './state-service/config';
import { IndentTripReportService } from './indent-trip-report.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../shared/services/alert.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-indent-trip-report',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, SharedModule],
  templateUrl: './indent-trip-report.component.html',
  styleUrl: './indent-trip-report.component.scss'
})
export class IndentTripReportComponent implements OnInit {
  token = localStorage.getItem('AccessToken') || '';
  groupId = localStorage.getItem('GroupId') || '';

  mpcNameList = signal<any[]>([]);
  plantList = signal<any[]>([]);
  dispatchLocationList = signal<any[]>([]);
  milkTypeList = signal<any[]>([]);
  tableData = signal<any[]>([]);

  private service = inject(IndentTripReportService);
  private toastService = inject(AlertService);
  private rawTableData: any[] = [];
  private expandedRows = new Set<string>();

  filterfields = computed<FieldConfig[]>(() => 
    indentTripFilterFields(
      this.mpcNameList(),
      this.plantList(),
      this.dispatchLocationList(),
      this.milkTypeList()
    )
  );

  gridConfig = signal<GridConfig>({
    Title: 'Indent_Trip_Report',
    theme: 'alpine',
    columns: indentTripGridColumns,
    pagination: true,
    paginationPageSize: 50,
    context: {
      componentParent: this,
    },
    getRowStyle: (params: any) =>
      params.data?.__rowType === 'detail'
        ? { background: '#f7faff' }
        : undefined,
  });

  ngOnInit() {
    this.loadFilterOptions();
    this.getTableData();
  }

  loadFilterOptions() {
    this.service.getFilterOptions().subscribe({
      next: (response) => {
        if (response?.Status === 'success' || response?.Status === 1) {
          const plantSupplier = response.PlantSupplier || [];
          const milk = response.Milk || [];

          const mpcData = plantSupplier
            .filter((item: any) => item.type === 6)
            .map((item: any) => ({ id: item.id, name: item.name || item.displayName }));
          
          const plantData = plantSupplier
            .filter((item: any) => item.type === 3)
            .map((item: any) => ({ id: item.id, name: item.name || item.displayName }));
          
          const dispatchData = plantSupplier
            .filter((item: any) => item.type === 4)
            .map((item: any) => ({ id: item.id, name: item.name || item.displayName }));

          const milkData = milk.map((item: any) => ({ 
            id: item.id, 
            name: item.displayName,
            displayName: item.displayName 
          }));

          this.mpcNameList.set(mpcData);
          this.plantList.set(plantData);
          this.dispatchLocationList.set(dispatchData);
          this.milkTypeList.set(milkData);
        }
      },
      error: (error) => {
        console.error('Error loading filter options:', error);
      }
    });
  }

  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    this.getTableData(data);
  }

  toggleRow(rowId: string): void {
    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId);
    } else {
      this.expandedRows.add(rowId);
    }

    this.tableData.set(this.buildDisplayRows(this.rawTableData));
  }

  private getRowId(row: any, index: number): string {
    return String(row?.IndentId || row?.IndentNo || row?.MpcName || index);
  }

  private getNumericValue(value: any): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private sumSubIndentValue(subIndents: any[], getter: (detail: any) => any): number {
    const total = subIndents.reduce((sum: number, detail: any) => {
      const value = Number(getter(detail) || 0);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);

    return Number(total.toFixed(2));
  }

  private avgSubIndentValue(subIndents: any[], getter: (detail: any) => any): number {
    const values = subIndents
      .map((detail: any) => Number(getter(detail) || 0))
      .filter((value: number) => Number.isFinite(value) && value !== 0);

    if (values.length === 0) return 0;

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Number(average.toFixed(2));
  }

  private createSummaryRow(rowD: any, rowId: string) {
    const subIndents = Array.isArray(rowD?.SubIndent) ? rowD.SubIndent : [];

    return {
      __rowId: rowId,
      __rowType: 'summary',
      __expanded: this.expandedRows.has(rowId),
      mpcName: `${rowD.MpcName || ''}-${rowD.MpcCode || ''}`,
      motherDairyPlant: rowD.Plant || '',
      milkType: rowD.MilkType || '',
      indentNo: rowD.IndentNo || '',
      indentDate: rowD.IndentDate || '',
      dispatchDate: rowD.DispatchDate || '',
      dispatchLocation: '',
      
      milkProjection_qty: this.sumSubIndentValue(subIndents, (detail) => detail?.MilkProjection?.Qty),
      milkProjection_fat: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkProjection?.Fat),
      milkProjection_snf: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkProjection?.Snf),
      milkProjection_mbrt: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkProjection?.Mbrt),
      
      milkDispatch_qty: this.sumSubIndentValue(subIndents, (detail) => detail?.MilkDispatchDetails?.Qty),
      milkDispatch_fat: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkDispatchDetails?.Fat),
      milkDispatch_snf: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkDispatchDetails?.Snf),
      milkDispatch_mbrt: this.avgSubIndentValue(subIndents, (detail) => detail?.MilkDispatchDetails?.Mbrt),
      
      actualMilk_qty: this.sumSubIndentValue(subIndents, (detail) => detail?.ActualMilkReceived?.Qty),
      actualMilk_fat: this.avgSubIndentValue(subIndents, (detail) => detail?.ActualMilkReceived?.Fat),
      actualMilk_snf: this.avgSubIndentValue(subIndents, (detail) => detail?.ActualMilkReceived?.Snf),
      actualMilk_mbrt: this.avgSubIndentValue(subIndents, (detail) => detail?.ActualMilkReceived?.Mbrt),
      
      deviation_indentVsDispatch: this.sumSubIndentValue(subIndents, (detail) => detail?.DeviationReport?.IndQty_DisQty),
      deviation_actual_qty: this.sumSubIndentValue(subIndents, (detail) => detail?.DeviationReport?.ActualDispatch?.Qty),
      deviation_actual_fat: this.avgSubIndentValue(subIndents, (detail) => detail?.DeviationReport?.ActualDispatch?.Fat),
      deviation_actual_snf: this.avgSubIndentValue(subIndents, (detail) => detail?.DeviationReport?.ActualDispatch?.Snf),
      
      deviation_remarks: '',
    };
  }

  private createDetailRows(rowD: any, rowId: string): any[] {
    const subIndents = Array.isArray(rowD?.SubIndent) ? rowD.SubIndent : [];
    
    return subIndents.map((detail: any, index: number) => ({
      __rowId: `${rowId}-detail-${index}`,
      __parentRowId: rowId,
      __rowType: 'detail',
      mpcName: `${rowD.MpcName || ''}-${rowD.MpcCode || ''}`,
      motherDairyPlant: rowD.Plant || '',
      milkType: rowD.MilkType || '',
      indentNo: rowD.IndentNo || '',
      indentDate: rowD.IndentDate || '',
      dispatchDate: rowD.DispatchDate || '',
      dispatchLocation: detail.DispatchLocation || '',
      
      milkProjection_qty: detail.MilkProjection?.Qty || 0,
      milkProjection_fat: detail.MilkProjection?.Fat || 0,
      milkProjection_snf: detail.MilkProjection?.Snf || 0,
      milkProjection_mbrt: detail.MilkProjection?.Mbrt || 0,
      
      milkDispatch_qty: detail.MilkDispatchDetails?.Qty || 0,
      milkDispatch_fat: detail.MilkDispatchDetails?.Fat || 0,
      milkDispatch_snf: detail.MilkDispatchDetails?.Snf || 0,
      milkDispatch_mbrt: detail.MilkDispatchDetails?.Mbrt || 0,
      
      actualMilk_qty: detail.ActualMilkReceived?.Qty || 0,
      actualMilk_fat: detail.ActualMilkReceived?.Fat || 0,
      actualMilk_snf: detail.ActualMilkReceived?.Snf || 0,
      actualMilk_mbrt: detail.ActualMilkReceived?.Mbrt || 0,
      
      deviation_indentVsDispatch: detail.DeviationReport?.IndQty_DisQty || 0,
      deviation_actual_qty: detail.DeviationReport?.ActualDispatch?.Qty || 0,
      deviation_actual_fat: detail.DeviationReport?.ActualDispatch?.Fat || 0,
      deviation_actual_snf: detail.DeviationReport?.ActualDispatch?.Snf || 0,
      
      deviation_remarks: detail.Remark || '',
    }));
  }

  private buildDisplayRows(rawData: any[]): any[] {
    const rows: any[] = [];

    rawData.forEach((rowData: any, index: number) => {
      const rowId = this.getRowId(rowData, index);
      rows.push(this.createSummaryRow(rowData, rowId));

      if (this.expandedRows.has(rowId)) {
        rows.push(...this.createDetailRows(rowData, rowId));
      }
    });

    return rows;
  }

  getTableData(formData?: any) {
    const today = new Date().toISOString().split('T')[0];
    const fromDate = formData?.fromDate || today;
    const toDate = formData?.toDate || today;

    const payload = createFormData(this.token, {
      FromDate: fromDate,
      ToDate: toDate,
      ForWeb: '1',
      Plant: String(formData?.plant?.id || ''),
      Mpc: String(formData?.mpcName?.id || ''),
      IndentNo: formData?.indentNo || '',
      DispatchLoc: String(formData?.dispatchLocation?.id || ''),
      Status: formData?.status?.id || '',
      MilkType: String(formData?.milkType?.id || ''),
    });

    this.service.getIndentTripReport(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'success' || res?.Status === 1) {
          const rawData = res?.Data || [];
          this.rawTableData = rawData;
          this.expandedRows.clear();
          this.tableData.set(this.buildDisplayRows(rawData));

          if (!rawData.length) {
            this.toastService.info(res?.Message || 'No data found');
          }
          return;
        }

        this.tableData.set([]);
        this.toastService.error(res?.Message || 'Error fetching indent trip report');
      },
      error: (err: any) => {
        console.error('Error fetching indent trip report:', err);
        this.tableData.set([]);
        this.toastService.error(
          err?.message || 'Error fetching indent trip report',
        );
      },
    });
  }
}
