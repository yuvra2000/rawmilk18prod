import { computed, inject, signal } from '@angular/core';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  detailsColumns,
  filterfields,
  gridColumns,
  delayColumns,
  statusColumns,
} from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  token,
  userType,
} from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { CartDashboardService } from '../cart-dashboard.service';
import {
  createReportParams,
  DashboardSummaryData,
  extractSummaryData,
  CustomTooltipComponent,
  DEFAULT_SUMMARY_DATA,
  buildFranchiseActiveCartChartConfig,
} from './utils';
import { StatCardConfig } from '../../../../shared/components/reusable-stat-card/model/stat-card.model';
import { ChartConfig } from '../../../../shared/components/reusable-chart/models/chart-config.model';

interface InitialData {
  cartDashboardData?: any[];
  addaList?: any[];
  franchiseList?: any[];
  regionList?: any[];
  highShipment?: boolean;
  summaryData?: DashboardSummaryData;
}

export class CartDashboardStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private cartDashService = inject(CartDashboardService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  loading = signal(false);
  initialData = signal<InitialData>({
    cartDashboardData: [],
    addaList: [],
    franchiseList: [],
    regionList: [],
    highShipment: true,
    summaryData: DEFAULT_SUMMARY_DATA,
  });
  rowData = computed<any[]>(() => this.initialData().cartDashboardData || []);
  summaryData = computed<DashboardSummaryData>(
    () => this.initialData().summaryData || DEFAULT_SUMMARY_DATA,
  );
  isAddaFilterEnabled = signal<boolean>(true);

  cartStatusCardConfig = computed<StatCardConfig>(() => {
    const cart = this.summaryData()?.cart_status;
    return {
      title: 'Cart Status',
      icon: 'fa-solid fa-cart-shopping',
      chartType: 'doughnut',
      chartData: [
        { name: 'En-Route', value: cart.enRoute, color: '#5676b8' },
        { name: 'At Base', value: cart.atBase, color: '#ea7f13' },
        { name: 'Inactive', value: cart.inactive, color: '#ff3b3f' },
        { name: 'No GPS', value: cart.noGps, color: '#8f84dc' },
      ],
    };
  });

  addaStatusCardConfig = computed<StatCardConfig>(() => {
    const eta = this.summaryData()?.adda_status;
    return {
      title: 'Adda Status',
      icon: 'fa-solid fa-location-dot',
      chartType: 'doughnut',
      chartData: [
        { name: 'Okay', value: eta.ok, color: '#6be58f' },
        { name: 'Lower Cart', value: eta.lower, color: '#5676b8' },
        { name: 'Higher Cart', value: eta.higher, color: '#8f84dc' },
        { name: 'No Cart', value: eta.noCart, color: '#ff3b3f' },
      ],
    };
  });

  franchiseActiveCartChartConfig = computed<ChartConfig>(() => {
    const supplierList = this.summaryData()?.franchise_wise_status || [];
    return buildFranchiseActiveCartChartConfig(supplierList);
  });

  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().franchiseList,
      this.initialData().addaList,
      this.initialData().regionList,
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
    height: '300px',
    tooltipComponent: CustomTooltipComponent,
  }));
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const reportParams = createReportParams();
      const listParams = createFormData(token, {
        group_id: GroupId,
      });
      const res: any = await firstValueFrom(
        this.cartDashService.initializePageData(reportParams, listParams),
      );
      handleSessionExpiry(res?.dashboardData, this.toast);
      const { dashboardData, addaList, franchiseList, regionList } = res || {};
      this.initialData.set({
        cartDashboardData: dashboardData?.Data || [],
        addaList: addaList?.Data || [],
        franchiseList: franchiseList?.Data || [],
        regionList:
          res.regionList?.Data?.map((r: any) => ({
            ...r,
            name: r.zone_code,
            id: r.zone_code,
          })) || [],
        summaryData: extractSummaryData(dashboardData?.Tiles || []),
      });
      console.log('Cart dashboard initial data:', this.initialData());
    } catch (error) {
      this.toast.error('Failed to load data');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  async viewDetails(
    row: any,
    type: 'authorised' | 'unauthorised' | 'delay' | 'total',
  ) {
    const params = createFormData(token, {
      group_id: GroupId,
      type: this.isAddaFilterEnabled() ? 'adda' : 'franchise',
      key: row?.name || '',
      mode: 'details',
      metric: type,
    });
    this.loading.set(true);
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.cartDashService.getDashReport(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      if (!res?.Data?.length) {
        this.toast.info('No details available');
        return;
      }
      this.modal.openGridModal({
        title: `${type === 'authorised' ? 'Authorised' : type === 'unauthorised' ? 'Un-authorised' : type === 'delay' ? 'Delayed' : 'Total'} Carts for ${row?.name || ''}`,
        columns:
          type === 'delay'
            ? detailsColumns
            : type === 'total'
              ? [...detailsColumns, ...delayColumns, ...statusColumns]
              : [...detailsColumns, ...delayColumns],
        rowData: res?.Data || [],
        size: 'xl',
        height: '300px',
      });
    } catch (error) {
      this.toast.error('Failed to view details');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  async onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    this.spinner.show();
    this.loading.set(true);
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
        summaryData: extractSummaryData(res),
      }));
    } catch (error) {
      this.toast.error('Failed to submit form');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  onFilterControlChange(event: any) {
    const isAddaFilterEnabled = event.value === true ? true : false;
    this.isAddaFilterEnabled.update(() => isAddaFilterEnabled);
    filterfields(
      this.initialData().franchiseList,
      this.initialData().addaList,
      this.initialData().regionList,
      this.isAddaFilterEnabled(),
    );
    this.lastFilterValues.set({
      ...this.lastFilterValues(),
      [event.controlName]: event.value,
    });
    this.fetchReportData();
  }
  async fetchReportData() {
    const type = this.isAddaFilterEnabled() ? 'adda' : 'franchise';
    const params = createReportParams(this.lastFilterValues(), type);
    this.loading.set(true);
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.cartDashService.getDashReport(params),
      );
      handleSessionExpiry(res, this.toast);
      this.initialData.update((prev) => ({
        ...prev,
        cartDashboardData: res?.Data || [],
      }));
    } catch (error) {
      this.toast.error('Failed to fetch report data');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
