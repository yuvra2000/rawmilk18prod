import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpcTripReportService } from './mpc-trip-report.service';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { mpcFilterFields, mpcGridColumns } from './state-service/config';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-mpc-trip-report',
  standalone: true,
  imports: [CommonModule, FilterFormComponent, CollapseWrapperComponent, AdvancedGridComponent],
  templateUrl: './mpc-trip-report.component.html',
  styleUrl: './mpc-trip-report.component.scss'
})
export class MpcTripReportComponent implements OnInit {
  dispatchLocations = signal<any[]>([]);
  plants = signal<any[]>([]);
  tableData = signal<any[]>([]);
  mpcService = inject(MpcTripReportService);
  private toastService = inject(AlertService);
  token: any;
  private rawTableData: any[] = [];
  private expandedRows = new Set<string>();

  filterfields = computed<FieldConfig[]>(() => mpcFilterFields(this.dispatchLocations(), this.plants()));

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: mpcGridColumns,
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

  constructor() { }

  ngOnInit(): void {
    this.token = localStorage.getItem('AccessToken');
    this.loadInitialData();
    this.getTableData();
  }

  loadInitialData(): void {

    const payload = createFormData(this.token, {
      GroupId: localStorage.getItem('GroupId')!,
      ForApp: '0'
    })

    this.mpcService.getIndentMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.PlantSupplier) {
          const dl = res.PlantSupplier.filter((item: any) => item.type === 4);
          const p = res.PlantSupplier.filter((item: any) => item.type === 3);
          this.dispatchLocations.set(dl);
          this.plants.set(p);
        }
      },
      error: (err: any) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  onFormSubmit(data: any): void {
    console.log('Form Submitted:', data);
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
    return String(row?.MpcId || row?.MpcCode || row?.MpcName || index);
  }

  private getNumericValue(value: any): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private sumSubIndentValue(subIndents: any[], getter: (detail: any) => any): number | null {
    const total = subIndents.reduce((sum: number, detail: any) => {
      const value = Number(getter(detail) || 0);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);

    return total ? Number(total.toFixed(2)) : null;
  }

  private avgSubIndentValue(subIndents: any[], getter: (detail: any) => any): number | null {
    const values = subIndents
      .map((detail: any) => Number(getter(detail) || 0))
      .filter((value: number) => Number.isFinite(value) && value !== 0);

    if (values.length === 0) return null;

    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    return Number(average.toFixed(2));
  }

  private createSummaryRow(rowData: any, rowId: string) {
    const subIndents = Array.isArray(rowData?.SubIndent) ? rowData.SubIndent : [];
    const firstDetail = subIndents[0] || {};

    return {
      __rowId: rowId,
      __rowType: 'summary',
      __expanded: this.expandedRows.has(rowId),
      mpcName: `${rowData?.MpcName || ''}${rowData?.MpcCode ? ` (${rowData.MpcCode})` : ''}`,
      mccName: firstDetail?.MccName || '',
      milkType: rowData?.MilkType || '',
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
      deviation_remarks: subIndents.map((detail: any) => detail?.Remark).filter(Boolean).join(', '),
    };
  }

  private createDetailRows(rowData: any, rowId: string): any[] {
    return (rowData?.SubIndent || []).map((detail: any, index: number) => ({
      __rowId: `${rowId}-detail-${index}`,
      __parentRowId: rowId,
      __rowType: 'detail',
      mpcName: `${rowData?.MpcName || ''}${rowData?.MpcCode ? ` (${rowData.MpcCode})` : ''}`,
      mccName: detail?.MccName || '',
      milkType: rowData?.MilkType || '',
      milkProjection_qty: this.getNumericValue(detail?.MilkProjection?.Qty),
      milkProjection_fat: this.getNumericValue(detail?.MilkProjection?.Fat),
      milkProjection_snf: this.getNumericValue(detail?.MilkProjection?.Snf),
      milkProjection_mbrt: this.getNumericValue(detail?.MilkProjection?.Mbrt),
      milkDispatch_qty: this.getNumericValue(detail?.MilkDispatchDetails?.Qty),
      milkDispatch_fat: this.getNumericValue(detail?.MilkDispatchDetails?.Fat),
      milkDispatch_snf: this.getNumericValue(detail?.MilkDispatchDetails?.Snf),
      milkDispatch_mbrt: this.getNumericValue(detail?.MilkDispatchDetails?.Mbrt),
      actualMilk_qty: this.getNumericValue(detail?.ActualMilkReceived?.Qty),
      actualMilk_fat: this.getNumericValue(detail?.ActualMilkReceived?.Fat),
      actualMilk_snf: this.getNumericValue(detail?.ActualMilkReceived?.Snf),
      actualMilk_mbrt: this.getNumericValue(detail?.ActualMilkReceived?.Mbrt),
      deviation_indentVsDispatch: this.getNumericValue(detail?.DeviationReport?.IndQty_DisQty),
      deviation_actual_qty: this.getNumericValue(detail?.DeviationReport?.ActualDispatch?.Qty),
      deviation_actual_fat: this.getNumericValue(detail?.DeviationReport?.ActualDispatch?.Fat),
      deviation_actual_snf: this.getNumericValue(detail?.DeviationReport?.ActualDispatch?.Snf),
      deviation_remarks: detail?.Remark || '',
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
    const status =
      formData?.status?.id === 'NO GPS'
        ? 'No GPS'
        : (formData?.status?.id || formData?.status || '');

    const payload = createFormData(this.token, {
      FromDate: fromDate,
      ToDate: toDate,
      ForWeb: '1',
      Plant: String(formData?.plant?.id || formData?.plant?.entity_id || ''),
      DispatchLoc: String(
        formData?.dispatchLocation?.id ||
          formData?.dispatchLocation?.entity_id ||
          '',
      ),
      Status: status,
    });

    this.mpcService.getMpcTripReport(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'success') {
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
        this.toastService.error(res?.Message || 'Error fetching trip report');
      },
      error: (err: any) => {
        console.error('Error fetching trip report:', err);
        this.tableData.set([]);
        this.toastService.error(
          err?.message || 'Error fetching trip report',
        );
      },
    });
  }
}
