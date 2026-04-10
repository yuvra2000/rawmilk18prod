import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { detailsColumns, filterfields, gridColumns } from './config';
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
import { StatCardConfig } from '../../../../shared/components/reusable-stat-card/model/stat-card.model';
import { ChartConfig } from '../../../../shared/components/reusable-chart/models/chart-config.model';

interface DashboardSummaryData {
  gps: {
    total: number;
    running: number;
    inactive: number;
    noGps: number;
    stopped: number;
  };
  eta: {
    total: number;
    lessThan2Hr: number;
    between2To4Hr: number;
    between4To6Hr: number;
    above6Hr: number;
  };
  supplier: {
    quantity1: number;
    quantity2: number;
    quantity3: number;
    name1: string;
    name2: string;
    name3: string;
    others: number;
  };
}

interface InitialData {
  cartDashboardData?: any[];
  addaList?: any[];
  franchiseList?: any[];
  highShipment?: boolean;
  summaryData?: DashboardSummaryData;
}

const DEFAULT_SUMMARY_DATA: DashboardSummaryData = {
  gps: {
    total: 0,
    running: 0,
    inactive: 0,
    noGps: 0,
    stopped: 0,
  },
  eta: {
    total: 0,
    lessThan2Hr: 0,
    between2To4Hr: 0,
    between4To6Hr: 0,
    above6Hr: 0,
  },
  supplier: {
    quantity1: 0,
    quantity2: 0,
    quantity3: 0,
    name1: 'Franchise 1',
    name2: 'Franchise 2',
    name3: 'Franchise 3',
    others: 0,
  },
};

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
    highShipment: true,
    summaryData: DEFAULT_SUMMARY_DATA,
  });
  rowData = computed<any[]>(() => this.initialData().cartDashboardData || []);
  summaryData = computed<DashboardSummaryData>(
    () => this.initialData().summaryData || DEFAULT_SUMMARY_DATA,
  );
  isAddaFilterEnabled = signal<boolean>(true);

  cartStatusCardConfig = computed<StatCardConfig>(() => {
    const gps = this.summaryData().gps;
    return {
      title: 'Cart Status',
      icon: 'fa-solid fa-cart-shopping',
      chartType: 'doughnut',
      chartData: [
        { name: 'Active', value: gps.running, color: '#1f4a8f' },
        { name: 'Delay', value: gps.stopped, color: '#ea7f13' },
        { name: 'Inactive', value: gps.inactive, color: '#ff3b3f' },
        { name: 'Non GPS', value: gps.noGps, color: '#c6c8ce' },
      ],
    };
  });

  addaStatusCardConfig = computed<StatCardConfig>(() => {
    const eta = this.summaryData().eta;
    return {
      title: 'Adda Status',
      icon: 'fa-solid fa-location-dot',
      chartType: 'doughnut',
      chartData: [
        { name: 'In-Route', value: eta.lessThan2Hr, color: '#2fb38b' },
        { name: 'Active', value: eta.between2To4Hr, color: '#1f4a8f' },
        { name: 'Off-Route', value: eta.between4To6Hr, color: '#c6c8ce' },
        { name: 'Inactive', value: eta.above6Hr, color: '#ff3b3f' },
      ],
    };
  });

  franchiseActiveCartChartConfig = computed<ChartConfig>(() => {
    const supplier = this.summaryData().supplier;
    const barData = [
      {
        name: supplier.name1 || 'Franchise 1',
        value: Number(supplier.quantity1) || 0,
      },
      {
        name: supplier.name2 || 'Franchise 2',
        value: Number(supplier.quantity2) || 0,
      },
      {
        name: supplier.name3 || 'Franchise 3',
        value: Number(supplier.quantity3) || 0,
      },
      { name: 'Others', value: Number(supplier.others) || 0 },
    ];

    return {
      type: 'bar',
      data: barData,
      plugins: [
        (options) => ({
          ...options,
          grid: {
            top: 34,
            left: 20,
            right: 20,
            bottom: 36,
            containLabel: true,
          },
          xAxis: {
            ...(Array.isArray(options.xAxis)
              ? options.xAxis[0]
              : options.xAxis),
            axisLabel: {
              rotate: 0,
              fontSize: 11,
              interval: 0,
            },
          },
          yAxis: {
            ...(Array.isArray(options.yAxis)
              ? options.yAxis[0]
              : options.yAxis),
            splitLine: {
              show: true,
              lineStyle: { type: 'dashed', color: '#d8dce5' },
            },
          },
          legend: {
            show: true,
            bottom: 6,
            itemHeight: 10,
            itemWidth: 10,
          },
          series: [
            {
              type: 'bar',
              barWidth: 42,
              data: barData.map((item, index) => ({
                value: item.value,
                itemStyle: {
                  color: ['#8f84dc', '#e48ad4', '#6be58f', '#f2a394'][index],
                },
              })),
            },
          ],
        }),
      ],
    };
  });

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
    height: '300px',
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
      handleSessionExpiry(res, this.toast);
      const { dashboardData, addaList, franchiseList } = res || {};
      this.initialData.set({
        cartDashboardData: dashboardData?.Data || [],
        addaList: addaList?.Data || [],
        franchiseList: franchiseList?.Data || [],
        summaryData: this.extractSummaryData(res),
      });
      console.log('Cart dashboard initial data:', this.initialData());
    } catch (error) {
      this.toast.error('Failed to load data');
    } finally {
      this.loading.set(false);
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
        title: `${type === 'authorised' ? 'Authorised' : type === 'unauthorised' ? 'Un-authorised' : 'Delayed'} Carts for ${row?.name || ''}`,
        columns: detailsColumns,
        rowData: res?.Data || [],
        size: 'xl',
      });
    } catch (error) {
      this.toast.error('Failed to view details');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  async onFormSubmit(data: any) {
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
        summaryData: this.extractSummaryData(res),
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
        summaryData: this.extractSummaryData(res),
      }));
    } catch (error) {
      this.toast.error('Failed to fetch report data');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }

  private extractSummaryData(res: any): DashboardSummaryData {
    const candidates = [
      res,
      res?.Data,
      res?.dashboardData,
      res?.dashboardSummary,
      res?.summary,
      res?.summaryData,
    ];

    const rawSummary =
      candidates.find((candidate) => this.hasSummarySections(candidate)) ||
      DEFAULT_SUMMARY_DATA;

    return {
      gps: {
        total: Number(rawSummary?.gps?.total) || 0,
        running: Number(rawSummary?.gps?.running) || 0,
        inactive: Number(rawSummary?.gps?.inactive) || 0,
        noGps: Number(rawSummary?.gps?.noGps) || 0,
        stopped: Number(rawSummary?.gps?.stopped) || 0,
      },
      eta: {
        total: Number(rawSummary?.eta?.total) || 0,
        lessThan2Hr: Number(rawSummary?.eta?.lessThan2Hr) || 0,
        between2To4Hr: Number(rawSummary?.eta?.between2To4Hr) || 0,
        between4To6Hr: Number(rawSummary?.eta?.between4To6Hr) || 0,
        above6Hr: Number(rawSummary?.eta?.above6Hr) || 0,
      },
      supplier: {
        quantity1: Number(rawSummary?.supplier?.quantity1) || 0,
        quantity2: Number(rawSummary?.supplier?.quantity2) || 0,
        quantity3: Number(rawSummary?.supplier?.quantity3) || 0,
        name1: rawSummary?.supplier?.name1 || 'Franchise 1',
        name2: rawSummary?.supplier?.name2 || 'Franchise 2',
        name3: rawSummary?.supplier?.name3 || 'Franchise 3',
        others: Number(rawSummary?.supplier?.others) || 0,
      },
    };
  }

  private hasSummarySections(data: any): boolean {
    return !!(
      data &&
      typeof data === 'object' &&
      data.gps &&
      data.eta &&
      data.supplier
    );
  }
}
