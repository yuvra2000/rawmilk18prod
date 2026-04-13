import { ITooltipParams } from 'ag-grid-community';
import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { ChartConfig } from '../../../../shared/components/reusable-chart/models/chart-config.model';

export interface TooltipField {
  label: string;
  key: string;
}

const DEFAULT_TOOLTIP_FIELDS: TooltipField[] = [
  { label: 'Name', key: 'name' },
  { label: 'Code', key: 'code' },
  { label: 'Geo Coord', key: 'latlng' },
];

export function createReportParams(filterValues?: any, type?: any) {
  //   let type = this.isFrenchise ? 'franchise' : 'adda';
  console.log('Creating report params with filter values:', filterValues);
  return createFormData(token, {
    type: type || 'adda',
    mode: 'dashboard',
    metric: 'total',
    key:
      type === 'franchise'
        ? filterValues?.franchise_code?.code
        : filterValues?.adda_code?.code,

    group_id: GroupId,
  });
}
export interface DashboardSummaryData {
  cart_status: {
    total: number;
    enRoute: number;
    inactive: number;
    noGps: number;
    atBase: number;
  };
  adda_status: {
    total: number;
    ok: number;
    lower: number;
    higher: number;
    noCart: number;
  };
  franchise_wise_status: FranchiseWiseStatusItem[];
}

export interface FranchiseWiseStatusItem {
  franchise_code: string;
  franchise_name: string;
  cartToBeSupplied: number;
  actualCart: number;
  totalCart?: number;
}
export function extractSummaryData(res: any): DashboardSummaryData {
  const candidates = [
    res,
    res?.Data,
    res?.dashboardData,
    res?.dashboardSummary,
    res?.summary,
    res?.summaryData,
  ];

  const candidateSummary = candidates.find((candidate) => {
    if (!candidate) {
      return false;
    }
    if (Array.isArray(candidate)) {
      return candidate.some(
        (item) =>
          item?.cart_status ||
          item?.adda_status ||
          item?.vrs_status ||
          item?.franchise_wise_status,
      );
    }
    return (
      candidate?.cart_status ||
      candidate?.adda_status ||
      candidate?.vrs_status ||
      candidate?.franchise_wise_status ||
      candidate?.vrs_supplier
    );
  });

  const rawSummary = Array.isArray(candidateSummary)
    ? candidateSummary.find(
        (item) =>
          item?.cart_status ||
          item?.adda_status ||
          item?.vrs_status ||
          item?.franchise_wise_status,
      ) || {}
    : candidateSummary || res || DEFAULT_SUMMARY_DATA;

  const vrsStatusRaw =
    rawSummary?.vrs_status ?? rawSummary?.franchise_wise_status ?? [];
  const franchiseWiseStatus: FranchiseWiseStatusItem[] = Array.isArray(
    vrsStatusRaw,
  )
    ? vrsStatusRaw
        .map((item: any) => ({
          franchise_code: String(item?.franchise_code ?? ''),
          franchise_name: String(item?.franchise_name ?? ''),
          cartToBeSupplied: Number(item?.cartToBeSupplied) || 0,
          actualCart: Number(item?.actualCart) || 0,
          totalCart: Number(item?.totalCart) || 0,
        }))
        .slice(0, 3)
    : [];

  return {
    cart_status: {
      total: Number(rawSummary?.cart_status?.total) || 0,
      enRoute: Number(rawSummary?.cart_status?.['In Route']) || 0,
      inactive: Number(rawSummary?.cart_status?.['Inactive']) || 0,
      noGps: Number(rawSummary?.cart_status?.['Non-GPS']) || 0,
      atBase: Number(rawSummary?.cart_status?.['At Base Location']) || 0,
    },
    adda_status: {
      total: Number(rawSummary?.adda_status?.total) || 0,
      ok: Number(rawSummary?.adda_status?.Ok) || 0,
      lower: Number(rawSummary?.adda_status?.['Lower No of Cart']) || 0,
      higher: Number(rawSummary?.adda_status?.['Higher No of Cart']) || 0,
      noCart: Number(rawSummary?.adda_status?.['No Cart']) || 0,
    },
    franchise_wise_status: franchiseWiseStatus,
  };
}

// Tooltip Component
@Component({
  selector: 'custom-tooltip',
  standalone: true,
  template: `
    <div class="custom-tooltip">
      <div>
        <b>{{ params.header }}</b>
        <!-- <span style="float:right;cursor:pointer;">X</span> -->
      </div>
      @if (params.tooltip) {
        <div>
          @for (field of tooltipFields; track field.key) {
            <span>{{ field.label }}: {{ getTooltipValue(field.key) }}</span
            ><br />
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .custom-tooltip {
        background: #fff;
        border: 1px solid #1e40af;
        border-radius: 10px;
        padding: 10px 16px;
        font-size: 15px;
        min-width: 220px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        color: #222;
      }
      .custom-tooltip b {
        color: #1d4380;
      }
    `,
  ],
})
export class CustomTooltipComponent implements ITooltipAngularComp {
  params!: ITooltipParams & {
    tooltip?: any;
    header?: string;
    tooltipFields?: TooltipField[];
  };
  tooltipFields: TooltipField[] = DEFAULT_TOOLTIP_FIELDS;

  agInit(
    params: ITooltipParams & {
      tooltip?: any;
      header?: string;
      tooltipFields?: TooltipField[];
    },
  ): void {
    console.log('Initializing tooltip with params:', params);
    this.params = params;
    this.tooltipFields = params.tooltipFields?.length
      ? params.tooltipFields
      : DEFAULT_TOOLTIP_FIELDS;
  }

  getTooltipValue(key: string): string {
    const value = this.params?.tooltip?.[key];
    return value === null || value === undefined || value === '' ? '-' : value;
  }
}
export const DEFAULT_SUMMARY_DATA: DashboardSummaryData = {
  cart_status: {
    total: 0,
    enRoute: 0,
    inactive: 0,
    noGps: 0,
    atBase: 0,
  },
  adda_status: {
    total: 0,
    ok: 0,
    lower: 0,
    higher: 0,
    noCart: 0,
  },
  franchise_wise_status: [
    {
      franchise_code: '=',
      franchise_name: '-',
      cartToBeSupplied: 0,
      actualCart: 0,
      totalCart: 0,
    },
  ],
};

export function buildFranchiseActiveCartChartConfig(
  supplierList: FranchiseWiseStatusItem[],
): ChartConfig {
  const groupedData = supplierList.flatMap((supplier) => {
    const franchiseName =
      supplier.franchise_name || supplier.franchise_code || 'Unknown';
    const franchiseCode = supplier.franchise_code || '';
    return [
      {
        name: `${franchiseName} (${franchiseCode})`,
        series: 'Cart To Be Supplied',
        value: Number(supplier.cartToBeSupplied) || 0,
      },
      {
        name: `${franchiseName} (${franchiseCode})`,
        series: 'Actual Cart',
        value: Number(supplier.actualCart) || 0,
      },
      {
        name: `${franchiseName} (${franchiseCode})`,
        series: 'Total Cart',
        value: Number(supplier.totalCart) || 0,
      },
    ];
  });

  return {
    type: 'groupedBar',
    data: groupedData,
    plugins: [
      (options) => ({
        ...options,
        grid: {
          top: 34,
          left: 15,
          right: 20,
          bottom: 25,
          containLabel: true,
        },
        xAxis: {
          ...(Array.isArray(options.xAxis) ? options.xAxis[0] : options.xAxis),
          axisLabel: {
            rotate: 0,
            fontSize: 12,
            interval: 0,
            align: 'center',
            verticalAlign: 'top',
            margin: 8,
            hideOverlap: false,
          },
          axisTick: { show: true, alignWithLabel: true },
          offset: 0,
        },
        yAxis: {
          ...(Array.isArray(options.yAxis) ? options.yAxis[0] : options.yAxis),
          splitLine: {
            show: true,
            lineStyle: { type: 'dashed', color: '#d8dce5' },
          },
        },
        legend: {
          show: true,
          bottom: 0,
          itemHeight: 8,
          itemWidth: 8,
        },
        tooltip: {
          trigger: 'item',
          axisPointer: { type: 'shadow' },
          formatter: (params: any) => {
            const name = params?.name || '';
            const series = params?.seriesName || '';
            const value = params?.value ?? 0;
            return `${name}<br/>${series}: ${value}`;
          },
        },
        series: (options.series as any[]).map((seriesItem) => ({
          ...seriesItem,
          barWidth: 28,
          barGap: '0%',
          barCategoryGap: '15%',
          itemStyle: {
            color:
              seriesItem.name === 'Cart To Be Supplied'
                ? '#8f84dc'
                : seriesItem.name === 'Actual Cart'
                  ? '#6be58f'
                  : '#f2a394',
          },
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
        })),
      }),
    ],
  };
}
