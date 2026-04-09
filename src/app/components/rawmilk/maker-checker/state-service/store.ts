import { computed, inject, signal } from '@angular/core';
import {
  mccMappingColumns,
  filterfields,
  ChillingMakerCheckerStatus,
  RemMakerCheckerStatus,
} from './config';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { createReportParams } from './utils';
import { AlertService } from '../../../../shared/services/alert.service';
import { ToastrService } from 'ngx-toastr';

import { NgxSpinnerService } from 'ngx-spinner';
import { MakerCheckerService } from '../maker-checker.service';
export interface InitialData {
  date?: any;
  userList?: any[];
  makerCheckerReportData: any[];
  makerCheckerList?: any[];
}
interface res {
  user: any;
  checkerMaker: any;
}
export class MakerCheckerStore {
  date = signal<string>(new Date().toISOString().split('T')[0]);
  private makerCheckerService = inject(MakerCheckerService);
  private toast = inject(ToastrService);
  private alert = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  initialData = signal<InitialData>({
    userList: [],
    makerCheckerReportData: [],
    makerCheckerList: [],
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
    filterfields(
      this.initialData().userList,
      this.initialData().makerCheckerList,
    ),
  );
  rowData = computed(() => this.initialData()?.makerCheckerReportData || []);
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
    isFitGridWidth: true,
  }));

  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const userParams = createFormData(token, {
        GroupId: GroupId,
        ForApp: '0',
      });
      const reportParams = createFormData(token, {
        ForApp: '0',
      });
      const res: res = await firstValueFrom(
        this.makerCheckerService.initializePageData(userParams, reportParams),
      );
      if (
        handleSessionExpiry(res?.user, this.toast) ||
        handleSessionExpiry(res?.checkerMaker, this.toast)
      ) {
        return;
      }

      this.initialData.set({
        makerCheckerReportData: res.checkerMaker?.Data,
        userList: res.user?.Data,
      });
      if (this.initialData().makerCheckerReportData?.length === 0) {
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
        this.makerCheckerService.assignMakerChecker(reportParams),
      );
      handleApiResponse(res, this.toast);
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

      const reportParams = createFormData(token, {
        ForWeb: '1',
      });
      const res: any = await firstValueFrom(
        this.makerCheckerService.getMakerCheckerList(reportParams),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      this.initialData.update((data) => ({
        ...data,
        makerCheckerReportData: res?.Data || [],
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
        'Deassign Mapping',
        'Are you sure you want to deassign this mapping?',
      )
      .then(async (confirmed) => {
        if (confirmed) {
          const params = createFormData(token, {
            id: data?.id,
            ForApp: '0',
          });
          try {
            this.spinner.show();
            this.loading.set(true);
            const res: any = await firstValueFrom(
              this.makerCheckerService.deAssignMakerChecker(params),
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
  onFilterChange(event: any) {
    console.log('Filter changed:', event);
    if (event?.controlName === 'userId') {
      console.log('User type', event?.value?.user_type);
      if (event?.value?.user_type == 'ChillingPlant') {
        this.initialData.update((data) => ({
          ...data,
          makerCheckerList: ChillingMakerCheckerStatus,
        }));
      } else {
        this.initialData.update((data) => ({
          ...data,
          makerCheckerList: RemMakerCheckerStatus,
        }));
      }
    }
    console.log(
      'Updated makerCheckerList:',
      this.initialData().makerCheckerList,
    );
  }
}
