import { ITooltipParams } from 'ag-grid-community';
import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

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
  gps: {
    total: number;
    enRoute: number;
    inactive: number;
    noGps: number;
    atBase: number;
  };
  eta: {
    total: number;
    ok: number;
    lower: number;
    higher: number;
    noCart: number;
  };
  supplier: {
    quantity1: number;
    quantity2: number;
    quantity3: number;
    name1: string;
    name2: string;
    name3: string;
  };
}
export const DEFAULT_SUMMARY_DATA: DashboardSummaryData = {
  gps: {
    total: 0,
    enRoute: 0,
    inactive: 0,
    noGps: 0,
    atBase: 0,
  },
  eta: {
    total: 0,
    ok: 0,
    lower: 0,
    higher: 0,
    noCart: 0,
  },
  supplier: {
    quantity1: 0,
    quantity2: 0,
    quantity3: 0,
    name1: 'Total No of Cart',
    name2: 'To be Supplied',
    name3: 'Actual Number of Cart',
  },
};
export function extractSummaryData(res: any): DashboardSummaryData {
  const candidates = [
    res,
    res?.Data,
    res?.dashboardData,
    res?.dashboardSummary,
    res?.summary,
    res?.summaryData,
  ];

  const rawSummary =
    candidates.find((candidate) => hasSummarySections(candidate)) ||
    DEFAULT_SUMMARY_DATA;

  return {
    gps: {
      total: Number(rawSummary?.gps?.total) || 0,
      enRoute: Number(rawSummary?.gps?.enRoute) || 0,
      inactive: Number(rawSummary?.gps?.inactive) || 0,
      noGps: Number(rawSummary?.gps?.noGps) || 0,
      atBase: Number(rawSummary?.gps?.atBase) || 0,
    },
    eta: {
      total: Number(rawSummary?.eta?.total) || 0,
      ok: Number(rawSummary?.eta?.ok) || 0,
      lower: Number(rawSummary?.eta?.lower) || 0,
      higher: Number(rawSummary?.eta?.higher) || 0,
      noCart: Number(rawSummary?.eta?.noCart) || 0,
    },
    supplier: {
      quantity1: Number(rawSummary?.supplier?.quantity1) || 0,
      quantity2: Number(rawSummary?.supplier?.quantity2) || 0,
      quantity3: Number(rawSummary?.supplier?.quantity3) || 0,
      name1: rawSummary?.supplier?.name1 || 'Franchise 1',
      name2: rawSummary?.supplier?.name2 || 'Franchise 2',
      name3: rawSummary?.supplier?.name3 || 'Franchise 3',
    },
  };
}

export function hasSummarySections(data: any): boolean {
  return !!(
    data &&
    typeof data === 'object' &&
    data.gps &&
    data.eta &&
    data.supplier
  );
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
