import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { cartColumns, filterfields } from './config';
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

import { CartReportService } from '../cart-report.service';
export class InitialData {
  vehicleList?: any[];
  addaList?: any[];
  franchiseList?: any[];
  cartReportData?: any[];
}
export class CartReportStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private cartReportService = inject(CartReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    vehicleList: [],
    addaList: [],
    franchiseList: [],
  });
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: cartColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
  }));
  rowData = computed<any[]>(() => this.initialData().cartReportData || []);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().vehicleList,
      this.initialData().addaList,
      this.initialData().franchiseList,
    ),
  );
  loading = signal(false);
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const vehicleParams = createFormData(token, {});
      const listParams = createFormData(token, {
        group_id: GroupId,
      });
      const res: any = await firstValueFrom(
        this.cartReportService.initializePageData(vehicleParams, listParams),
      );
      if (
        handleSessionExpiry(res?.reportData, this.toast) ||
        handleSessionExpiry(res?.masterOptions, this.toast)
      ) {
        return;
      }
      console.log('Vehicle list', res.vehicleList?.VehicleList);
      this.initialData.set({
        vehicleList: mapVehicleListToOptions(res.vehicleList?.VehicleList),
        addaList: res.addaList?.Data,
        franchiseList: res.franchiseList?.Data,
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.spinner.hide();
      this.loading.set(false);
    }
  }
  onFormSubmit(data: any) {
    const selectedFrom =
      data?.from || new Date().toISOString().substring(0, 10);
    const selectedTo = data?.to;

    this.initialData.update((prev) => ({
      ...prev,
      from: selectedFrom,
      to: selectedTo,
    }));

    this.lastFilterValues.set(data);

    const params = createReportParams(selectedFrom, selectedTo, data);

    this.loadReportData(params);
  }

  private async loadReportData(params: FormData) {
    this.spinner.show();
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.cartReportService.getCartReport(params),
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
        cartReportData: res?.Data || { columns: [], data: [] },
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
