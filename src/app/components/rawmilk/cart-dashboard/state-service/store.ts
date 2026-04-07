import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { cartDashboardDummyData, filterfields, gridColumns } from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  supplier_id,
  token,
  userType,
} from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { CartDashboardService } from '../cart-dashboard.service';
import { createReportParams } from './utils';
interface InitialData {
  cartDashboardData?: any[];
  addaList?: any[];
  franchiseList?: any[];
  highShipment?: boolean;
}
export class CartDashboardStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private cartDashService = inject(CartDashboardService);
  private modal = inject(UniversalModalService);
  cartDashboardDummyData = cartDashboardDummyData;
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    cartDashboardData: [],
    addaList: [],
    franchiseList: [],
    highShipment: true,
  });
  rowData = computed<any[]>(() => this.initialData().cartDashboardData || []);
  isAddaFilterEnabled = signal<boolean>(true);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().franchiseList,
      this.initialData().addaList,
      this.isAddaFilterEnabled(),
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
  }));
  async loadInitialData() {
    this.spinner.show();
    try {
      const reportParams = createReportParams();
      const listParams = createFormData(token, {
        group_id: GroupId,
      });
      const res: any = await firstValueFrom(
        this.cartDashService.initializePageData(reportParams, listParams),
      );
      handleSessionExpiry(res, this.toast);
      const { dashboardData, addaList, franchiseList } = res || {};
      this.initialData.set({
        cartDashboardData: dashboardData?.Data || [],
        addaList: addaList?.Data || [],
        franchiseList: franchiseList?.Data || [],
      });
      console.log('Cart dashboard initial data:', this.initialData());
    } catch (error) {
      this.toast.error('Failed to load data');
    } finally {
      this.spinner.hide();
    }
  }
  async viewDetails(row: any, type: 'authorised' | 'unauthorised' | 'delay') {
    const params = createFormData(token, {
      group_id: GroupId,
      type: this.isAddaFilterEnabled() ? 'adda' : 'franchise',
      key: row?.name || '',
      mode: 'details',
      metric: type,
    });
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.cartDashService.getDashReport(params),
      );
      handleSessionExpiry(res, this.toast);
      const { dashboardData } = res || {};
      const detailsData = dashboardData?.Data || [];
      this.modal.openGridModal({
        title: `${type === 'authorised' ? 'Authorised' : type === 'unauthorised' ? 'Un-authorised' : 'Delayed'} Carts for ${row?.name || ''}`,
        columns: [],
        rowData: detailsData,
      });
    } catch (error) {
      this.toast.error('Failed to view details');
    } finally {
      this.spinner.hide();
    }
  }
  async onFormSubmit(data: any) {
    this.spinner.show();
    const type = this.isAddaFilterEnabled() ? 'adda' : 'franchise';
    const params = createReportParams(data, type);
    try {
      const res: any = await firstValueFrom(
        this.cartDashService.getDashReport(params),
      );
      handleSessionExpiry(res, this.toast);
      const { dashboardData } = res || {};
      this.initialData.update((prev) => ({
        ...prev,
        cartDashboardData: dashboardData?.Data || [],
      }));
    } catch (error) {
      this.toast.error('Failed to submit form');
    } finally {
      this.spinner.hide();
    }
  }
  onFilterControlChange(event: any) {
    const isAddaFilterEnabled = event.value === true ? true : false;
    this.isAddaFilterEnabled.update(() => isAddaFilterEnabled);
    console.log('Filter control change:', event.controlName, event.value);
    filterfields(
      this.initialData().franchiseList,
      this.initialData().addaList,
      this.isAddaFilterEnabled(),
    );
    this.lastFilterValues.set({
      ...this.lastFilterValues(),
      [event.controlName]: event.value,
    });
  }
}
