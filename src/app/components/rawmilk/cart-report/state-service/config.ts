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
    width: 90,
  },
  {
    headerName: 'Start Time',
    field: 'start_time',
  },
  {
    headerName: 'End Time',
    field: 'end_time',
  },
  {
    headerName: 'Adda Name',
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
    valueGetter: (params: any) => {
      const franchiseName = params.data?.franchise_name || '';
      const franchiseCode = params.data?.franchise_code || '';
      return franchiseName && franchiseCode
        ? `${franchiseName} -${franchiseCode}`
        : franchiseName || franchiseCode || '-';
    },
  },
  {
    headerName: 'Cart no',
    field: 'cart_no',
  },
  {
    headerName: 'Cart Start Time',
    field: 'cart_start_time',
  },
  {
    headerName: 'Cart End Time',
    field: 'cart_end_time',
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
  },
  {
    headerName: 'Region',
    field: 'region_code',
  },
];
