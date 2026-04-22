import { computed, inject, signal } from '@angular/core';
import {
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { addaWiseFilterFields, cartDetailColumns } from './config';
import { handleSessionExpiry } from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { createReportParams, parseAddaWiseDynamicGridData } from './utils';
import { AddaWiseReportService } from '../adda-wise-report.service';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';

export class InitialData {
  addaWiseReportList: any[] = [];
}
export class AddaWiseReportState {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private addaWiseReportService = inject(AddaWiseReportService);
  private modalService = inject(UniversalModalService);
  columns = signal<GridColumnConfig[]>([]);
  date = signal<string>('');
  initialData = signal<InitialData>({
    addaWiseReportList: [],
  });
  columnConfig = computed<GridConfig>(() => {
    return {
      theme: 'alpine',
      columns: this.columns(),
      pagination: true,
      paginationPageSize: 50,
      enableSearch: true,
      enableExport: true,
      context: {
        componentParent: this,
      },
    };
  });
  loading = signal(false);
  rowData = computed<any[]>(() => this.initialData().addaWiseReportList || []);
  filterfields = signal<FieldConfig[]>(addaWiseFilterFields);
  onFormSubmit(data: any) {
    const from = data?.from || data?.fromDate;
    const to = data?.to || data?.toDate;
    if (from && to && new Date(from) > new Date(to)) {
      this.toast.info('From Date cannot be later than To Date.');
      return;
    }

    if (from && to) {
      const fromDate = new Date(`${from}T00:00:00`);
      const toDate = new Date(`${to}T00:00:00`);
      const diffInDays =
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays > 31) {
        this.toast.info('Date range cannot be more than 31 days.');
        return;
      }
    }

    const params = createReportParams(data);
    this.loadReportData(params);
  }

  showDetailModal(tooltip: any, dateHeader: string) {
    const detailRows = Array.isArray(tooltip) ? tooltip : [tooltip];
    if (detailRows.length === 0) {
      this.toast.info('No details available for this entry.');
      return;
    }
    this.modalService.openGridModal({
      title: `Cart Details - ${dateHeader}`,
      columns: cartDetailColumns,
      rowData: detailRows,
      size: 'lg',
      showFooter: false,
      height: '300px',
    });
  }

  private async loadReportData(params: FormData) {
    this.spinner.show();
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.addaWiseReportService.getAddaWiseReportData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }

      const payload = res || [];
      const { columns, rows } = parseAddaWiseDynamicGridData(
        payload,
        (tooltip: any, dateHeader: string) =>
          this.showDetailModal(tooltip, dateHeader),
      );

      this.columns.set(columns);
      if (rows.length === 0) {
        this.toast.info('No data found for the selected criteria.');
      }
      this.initialData.update((prev) => ({
        ...prev,
        addaWiseReportList: rows,
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
