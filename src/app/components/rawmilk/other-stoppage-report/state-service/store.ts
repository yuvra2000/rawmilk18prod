import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  stoppageReportColumns,
  otherStoppageFilterFields as filterFields,
} from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  mapVehicleListToOptions,
  supplier_id,
  token,
  userType,
} from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { createReportParams } from './utils';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { OtherStoppageReportService } from '../other-stoppage-report.service';

export class InitialData {
  vehicleList?: any[];
  otherStoppageReportData?: any[];
}
export class OtherStoppageReportStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private otherStoppageService = inject(OtherStoppageReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    vehicleList: [],
    otherStoppageReportData: [],
  });
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: stoppageReportColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    isFitGridWidth: true,
    height: '55vh',
  }));
  rowData = computed<any[]>(
    () => this.initialData().otherStoppageReportData || [],
  );
  filterfields = computed<any[]>(() =>
    filterFields(this.initialData().vehicleList),
  );

  loading = signal(false);
  async loadInitialData() {
    try {
      this.spinner.show();
      this.loading.set(true);
      const formData = createFormData(token, {});
      const res: any = await firstValueFrom(
        this.otherStoppageService.getVehicleList(formData),
      );
      this.initialData.set({
        vehicleList: mapVehicleListToOptions(res.VehicleList),
      });
    } catch (error: any) {
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  onFormSubmit(data: any) {
    const fromDate = data?.from;
    const toDate = data?.to;
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      this.toast.error('From date cannot be later than To date.');
      return;
    }
    const params = createReportParams(data);
    this.loadReportData(params);
  }

  private async loadReportData(params: FormData) {
    this.spinner.show();
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.otherStoppageService.getReport(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      const rows = res?.data || res?.Data || [];
      if (rows.length === 0) {
        this.toast.info('No data found for the selected criteria.');
      }
      this.initialData.update((prev) => ({
        ...prev,
        otherStoppageReportData: res?.Data || { columns: [], data: [] },
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
