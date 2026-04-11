import { computed, inject, signal } from '@angular/core';
import { GridConfig } from '../../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { filterfields, gridColumns } from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  mapVehicleListToOptions,
  token,
  userType,
} from '../../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UniversalModalService } from '../../../../../shared/services/universal-modal.service';
import { HaltReportService } from '../halt-report.service';

interface InitialData {
  threshold?: any;
  vehicleList?: any[];
  reportData?: any[];
  geoFenceList?: any[];
}
export class HaltReportStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private haltReportService = inject(HaltReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  loading = signal(false);
  initialData = signal<InitialData>({
    vehicleList: [],
    reportData: [],
    geoFenceList: [],
    threshold: 300,
  });
  rowData = computed<any[]>(() => this.initialData().reportData || []);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().vehicleList,
      this.initialData().geoFenceList,
    ),
  );
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: gridColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    height: '300px',
  }));

  async onFormSubmit(data: any) {}
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const params = createFormData(token, {});
      const res: any = await firstValueFrom(
        this.haltReportService.initializePageData(params),
      );

      this.initialData.set({
        vehicleList: mapVehicleListToOptions(res.vehicleList?.VehicleList),
        geoFenceList: res?.geofenceList?.Data || [],
      });
    } catch (error: any) {
      console.log('Error loading initial data:', error);
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
