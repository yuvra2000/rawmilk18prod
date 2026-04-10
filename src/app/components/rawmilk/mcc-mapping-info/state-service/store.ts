import { computed, inject, signal } from '@angular/core';
import { mccMappingColumns, filterfields, dummyMccMappingData } from './config';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import {
  createFormData,
  handleApiResponse,
  handleSessionExpiry,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { createReportParams } from './utils';
import { Router } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MccMappingInfoService } from '../mcc-mapping-info.service';
export interface InitialData {
  date?: any;
  mccList?: any[];
  mccMappingInfoData: any[];
}
interface res {
  masterOptions: any;
  reportData: any;
}
export class MCCMappingInfoStore {
  date = signal<string>(new Date().toISOString().split('T')[0]);
  private mccMappingInfoService = inject(MccMappingInfoService);
  private toast = inject(ToastrService);
  private alert = inject(AlertService);
  private router = inject(Router);
  private modalService = inject(UniversalModalService);
  private spinner = inject(NgxSpinnerService);
  token = localStorage.getItem('AccessToken') || '';
  GroupId = localStorage.getItem('GroupId') || '';
  supplier_id = localStorage.getItem('supplier_id') || '';
  user_type = localStorage.getItem('AccountType') || '';
  initialData = signal<InitialData>({
    date: '',
    mccList: [],
    mccMappingInfoData: [],
  });
  loading = signal(false);
  constructor() {
    this.initialData.update((data) => ({
      ...data,
      date: new Date().toISOString().substring(0, 10),
    }));
    this.loadInitialData();
  }
  filterfields = computed<any[]>(() =>
    filterfields(this.initialData().mccList),
  );
  rowData = computed(() => this.initialData()?.mccMappingInfoData || []);
  // rowData = computed(() => dummyMccMappingData);
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: mccMappingColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    height: '300px',
  }));

  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const masterFilterParams = createFormData(this.token, {
        GroupId: this.GroupId,
        ForApp: '0',
      });
      const reportParams = createFormData(this.token, {
        ForWeb: '1',
      });
      const res: res = await firstValueFrom(
        this.mccMappingInfoService.initializePageData(
          masterFilterParams,
          reportParams,
        ),
      );
      if (
        handleSessionExpiry(res?.reportData, this.toast) ||
        handleSessionExpiry(res?.masterOptions, this.toast)
      ) {
        return;
      }

      this.initialData.set({
        mccMappingInfoData: res.reportData?.Data,
        mccList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 4,
        ),
      });
      if (this.initialData().mccMappingInfoData?.length === 0) {
        this.toast.info('No mapping found');
      }
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  async onFormSubmit(filterValues: any) {
    this.spinner.show();
    this.loading.set(true);
    try {
      // Format date range and create report params with filter values
      const reportParams = createReportParams(filterValues);

      // Call the production planning API
      const res: any = await firstValueFrom(
        this.mccMappingInfoService.createMCCMapping(reportParams),
      );

      this.fetchReportData();
    } catch (error) {
      console.error('Error fetching production planning data:', error);
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  fetchReportData = async () => {
    try {
      this.loading.set(true);
      this.spinner.show();

      const reportParams = createFormData(this.token, {
        ForWeb: '1',
      });
      const res: any = await firstValueFrom(
        this.mccMappingInfoService.getMCCMappingReport(reportParams),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      this.initialData.update((data) => ({
        ...data,
        mccMappingInfoData: res?.Data || [],
      }));
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  };
  deleteMapping(data: any) {
    this.alert
      .confirmDelete(
        'Delete Mapping',
        'Are you sure you want to delete this mapping?',
      )
      .then(async (confirmed) => {
        if (confirmed) {
          const params = createFormData(token, {
            MccMappingId: data?.ID,
            ForWeb: '1',
          });
          try {
            this.spinner.show();
            this.loading.set(true);
            const res: any = await firstValueFrom(
              this.mccMappingInfoService.deleteMCCMapping(params),
            );
            if (
              res.Status == 'Success' ||
              res.status == 'success' ||
              res.Status == 'success'
            ) {
              this.toast.success(res.Message || 'Mapping deleted successfully');
            } else {
              this.toast.error(res?.Message || 'Error deleting mapping');
            }
          } catch (error: any) {
            this.toast.error(error?.error?.message || 'Error deleting mapping');
          } finally {
            this.loading.set(false);
            this.spinner.hide();
          }
          this.fetchReportData();
        }
      });
  }
}
