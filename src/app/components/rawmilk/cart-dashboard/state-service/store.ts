import { computed, inject, signal } from '@angular/core';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  detailsColumns,
  filterfields,
  gridColumns,
  delayColumns,
  statusColumns,
  cartDetailsColumns,
  addaDetailsColumns,
  franchiseDetailsColumns,
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
  DashboardTileData,
} from './utils';
import { StatCardConfig } from '../../../../shared/components/reusable-stat-card/model/stat-card.model';
import { ChartConfig } from '../../../../shared/components/reusable-chart/models/chart-config.model';
import { MapModalData } from '../../../../shared/components/google-map-viewer/map-modal';

interface InitialData {
  cartDashboardData?: any[];
  addaList?: any[];
  franchiseList?: any[];
  regionList?: any[];
  highShipment?: boolean;
  summaryData?: DashboardSummaryData;
  tileData?: DashboardTileData;
  tiles?: any;
}

export class CartDashboardStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private cartDashService = inject(CartDashboardService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  loading = signal(false);
  mapMarkers = signal<any[]>([
    { lat: 28.6139, lng: 77.209 },
    { lat: 19.076, lng: 72.8777 },
    { lat: 13.0827, lng: 80.2707 },
  ]);
  initialData = signal<InitialData>({
    cartDashboardData: [],
    addaList: [],
    franchiseList: [],
    regionList: [],
    highShipment: true,
    summaryData: DEFAULT_SUMMARY_DATA,
    tiles: {},
    tileData: {},
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
        { name: 'In Route', value: cart.enRoute, color: '#5676b8' },
        { name: 'At Base Location', value: cart.atBase, color: '#ea7f13' },
        { name: 'Inactive', value: cart.inactive, color: '#ff3b3f' },
        { name: 'Non-GPS', value: cart.noGps, color: '#8f84dc' },
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
        { name: 'Ok', value: eta.ok, color: '#6be58f' },
        { name: 'Lower No of Cart', value: eta.lower, color: '#5676b8' },
        { name: 'Higher No of Cart', value: eta.higher, color: '#8f84dc' },
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
        tiles: dashboardData?.Tiles || [],
        tileData: dashboardData?.TilesData || [],
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
              ? // ? [...detailsColumns, ...delayColumns, ...statusColumns]
                [...detailsColumns, ...delayColumns]
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
        cartDashboardData: res?.Data || [],
        tileData: dashboardData?.TilesData || [],
        tiles: dashboardData?.Tiles || [],
        // summaryData: extractSummaryData(res),
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
  onFranchiseWiseCartChartClick(event: any) {
    const seriesMap: any = {
      '0': 'Cart To Be Supplied',
      '1': 'Actual Cart',
      '2': 'Total Cart',
    };
    this.modal.openGridModal({
      title: `${seriesMap[event?.seriesIndex]} for ${event?.name}`,
      columns: franchiseDetailsColumns,
      rowData: this.initialData().tileData?.vrs_data?.[event?.name] || [],
      size: 'lg',
      fitGridWidth: true,
      height: '300px',
    });
  }
  onCartStatusSliceClick(event: any) {
    this.modal.openGridModal({
      title: `Carts with status: ${event.clickedSlice?.name}`,
      columns: cartDetailsColumns,
      rowData:
        this.initialData().tileData?.cart_data?.[event.clickedSlice?.name] ||
        [],
      size: 'lg',
      fitGridWidth: true,
      height: '300px',
    });
  }
  onAddaStatusSliceClick(event: any) {
    this.modal.openGridModal({
      title: `Adda with status: ${event.clickedSlice?.name}`,
      columns: addaDetailsColumns,
      rowData:
        this.initialData().tileData?.adda_data?.[event.clickedSlice?.name] ||
        [],
      size: 'lg',
      fitGridWidth: true,
      height: '300px',
    });
  }
  onMapClick() {
    this.mapMarkers.set([
      { lat: 28.6139, lng: 77.209 },
      { lat: 19.076, lng: 72.8777 },
      { lat: 13.0827, lng: 80.2707 },
    ]);
    const modalCOnfig: MapModalData = {
      title: 'Cart Locations',
      initialData: {
        locationsPromise: Promise.resolve(this.mapMarkers()),
        center: { lat: 28.6139, lng: 77.209 },
        zoom: 8,
      },
      size: 'xl',
    };
    this.modal.openMapModal(modalCOnfig);
  }
}
