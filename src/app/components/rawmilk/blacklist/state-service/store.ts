import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  filterfields,
  reportTypeList,
  vehiclewiseColumns,
  transporterwiseColumns,
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
import {
  createMasterParams,
  createReportParams,
  createTankerParams,
} from './utils';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { BlacklistService } from '../blacklist.service';

export class InitialData {
  transporterList?: any[];
  vehicleList?: any[];
  blackListData?: any[];
  reportType?: any;
}
export class BlackListStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private blackListService = inject(BlacklistService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    transporterList: [],
    vehicleList: [],
    blackListData: [],
    reportType: '1',
  });
  initialDataF = signal({
    reportType: reportTypeList[0] ?? { id: '1', name: 'Vehiclewise' },
    Type: { id: 'All', name: 'All' },
  });
  columnConfig = computed<GridConfig>(() => {
    const reportType = this.initialData().reportType;
    const columns =
      reportType === '2' ? transporterwiseColumns : vehiclewiseColumns;
    return {
      theme: 'alpine',
      columns: columns,
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
  rowData = computed<any[]>(() => this.initialData().blackListData || []);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().vehicleList,
      this.initialData().transporterList,
      this.initialData().reportType,
    ),
  );
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const masterParams = createMasterParams();
      const tankerParams = createTankerParams();
      const res: any = await firstValueFrom(
        this.blackListService.initializePageData(masterParams, tankerParams),
      );
      if (handleSessionExpiry(res?.tankerTranspList, this.toast)) {
        return;
      }
      this.initialData.update((prev) => ({
        ...prev,
        transporterList:
          res.tankerTranspList?.TransporterList.map((tr: any) => ({
            name: tr.TransporterName,
            id: tr.TransporterId,
          })) || [],
        vehicleList:
          res.tankerTranspList?.Data.map((v: any) => ({
            name: v.VehicleNo,
            id: v.VehicleNo,
          })) || [],
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    this.initialData.update((prev) => ({
      ...prev,
      reportType: data.reportType?.id || { id: '1', name: 'Vehiclewise' },
    }));

    this.lastFilterValues.set(data);

    const params = createReportParams(data);

    this.loadReportData(params);
  }

  private async loadReportData(params: FormData) {
    this.spinner.show();
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.blackListService.vehicleWiseReport(params),
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
        blackListData: res?.Data || { columns: [], data: [] },
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.loading.set(false);

      this.spinner.hide();
    }
  }
  async onFieldChange(event: any) {
    if (event?.controlName === 'reportType') {
      const selectedReportType = event?.value?.id || event?.value;
      this.initialData.update((prev) => ({
        ...prev,
        reportType: selectedReportType,
      }));
    }
  }
}
