import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

const dayLabelMap: Record<string, string> = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

export const filterfields = (
  vehicleList: Option[] = [],
  addaList: Option[] = [],
  franchiseList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    type: 'datetime',
    label: 'From Date',
    placeholder: 'Select From Date',

    class: 'col-md-2',
  },
  {
    name: 'to',
    type: 'datetime',
    label: 'To Date',
    placeholder: 'Select To Date',

    class: 'col-md-2',
  },
  {
    name: 'adda_code',
    type: 'select',
    label: 'Adda',
    placeholder: 'Select Adda',
    options: addaList,
    bindLabel: 'name',
    class: 'col-md-2',
  },
  {
    name: 'franchise_code',
    type: 'select',
    label: 'Franchise Type',
    placeholder: 'Select Franchise',
    options: franchiseList,
    bindLabel: 'name',
    class: 'col-md-2',
  },
  {
    name: 'cart_no',
    type: 'select',
    label: 'Cart No',
    placeholder: 'Select Cart No',
    options: vehicleList,
  },
];
// export const cartColumns: GridColumnConfig[] = [];
export const cartColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 70,
  },
  {
    headerName: 'Cart no',
    field: 'cart_no',
    width: 150,
  },
  {
    headerName: 'Adda Name',
    field: 'adda_name',
    valueGetter: (params: any) => {
      const addaName = params.data?.adda_name || '';
      const addaCode = params.data?.adda_code || '';
      return addaName && addaCode
        ? `${addaName} -${addaCode}`
        : addaName || addaCode || '-';
    },
  },
  {
    headerName: 'Franchise Name',
    field: 'franchise_name',
    width: 150,
    valueGetter: (params: any) => {
      const franchiseName = params.data?.franchise_name || '';
      const franchiseCode = params.data?.franchise_code || '';
      return franchiseName && franchiseCode
        ? `${franchiseName} -${franchiseCode}`
        : franchiseName || franchiseCode || '-';
    },
  },

  {
    headerName: 'Start Time',
    field: 'cart_start_time',
  },
  {
    headerName: 'End Time',
    field: 'cart_end_time',
  },
  {
    headerName: 'Duration',
    field: 'duration',
    minWidth: 100,
    width: 100,
    headerTooltip: 'Duration in minutes',
  },
  {
    headerName: 'Day',
    valueGetter: (params: any) => {
      const dayValue = params.data?.day;
      if (dayValue === undefined || dayValue === null || dayValue === '') {
        return '-';
      }
      const dayKey = String(dayValue).toUpperCase();
      return dayLabelMap[dayKey] || String(dayValue);
    },
    width: 120,
  },
  {
    headerName: 'Scheduled Time ',
    field: 'scheduled_time',
  },
  {
    headerName: 'Region',
    field: 'region_code',
    width: 120,
  },
  {
    headerName: 'Adda GeoCoords',
    field: 'adda_latlng',
  },
  {
    headerName: 'Base Location Dist',
    field: 'nearest_base_dist',
    width: 100,
    headerTooltip: 'Distance from nearest base location in km',
  },
];
