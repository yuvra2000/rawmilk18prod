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
import {
  createMasterParams,
  createReportParams,
  createTankerParams,
} from './utils';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { AgreementInfoService } from '../agreement-info.service';

export class InitialData {
  transporterList?: any[];
  vehicleList?: any[];
  mccList?: any[];
  agreementReportData?: any[];
}
export class CartReportExceptionStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private agreementInfoService = inject(AgreementInfoService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    transporterList: [],
    vehicleList: [],
    mccList: [],
    agreementReportData: [],
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
  loading = signal(false);
  rowData = computed<any[]>(() => this.initialData().agreementReportData || []);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().vehicleList,
      this.initialData().transporterList,
      this.initialData().mccList,
    ),
  );
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const masterParams = createMasterParams();
      const tankerParams = createTankerParams();
      const res: any = await firstValueFrom(
        this.agreementInfoService.initializePageData(
          masterParams,
          tankerParams,
        ),
      );
      if (
        handleSessionExpiry(res?.reportData, this.toast) ||
        handleSessionExpiry(res?.masterOptions, this.toast)
      ) {
        return;
      }
      this.initialData.set({
        transporterList:
          res.tankerTranspList?.TransporterList.map((tr: any) => ({
            name: tr.TransporterName,
            id: tr.TransporterId,
          })) || [],
        agreementReportData: res.reportData?.Data || [],
        vehicleList:
          res.tankerTranspList?.Data.map((v: any) => ({
            name: v.VehicleNo,
            id: v.VehicleNo,
          })) || [],
        mccList:
          res.createIndentMaster?.PlantSupplier.filter(
            (item: any) => item.type == '4',
          ) || [],
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
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
        this.agreementInfoService.AgreementInfoReport(params),
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
