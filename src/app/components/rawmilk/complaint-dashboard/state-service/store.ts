import { computed, inject, signal } from '@angular/core';
import {
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { complaintFilterFields } from './config';
import {
  handleApiResponse,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { createMasterParams, createReportParams } from './utils';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { ComplaintDashboardService } from '../complaint-dashboard.service';

export class InitialData {
  addaWiseReportList: any[] = [];
}
export class ComplaintDashboardReportState {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private complaintDashService = inject(ComplaintDashboardService);
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
  filterfields = signal<FieldConfig[]>(complaintFilterFields);
  async loadInitialData() {
    try {
      this.spinner.show();
      this.loading.set(true);
      const params = createMasterParams();
      const res: any = await firstValueFrom(
        this.complaintDashService.initialData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(
        res?.addaList,
        this.toast,
        undefined,
        'Failed to load Adda list',
        '',
      );
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
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
  private async loadReportData(params: FormData) {
    this.spinner.show();
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.complaintDashService.getAddaWiseReportData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      this.initialData.update((prev) => ({
        ...prev,
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
