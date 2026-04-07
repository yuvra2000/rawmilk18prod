import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

const formatDateTime = (value: any): string => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const rawHour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const amPm = rawHour >= 12 ? 'PM' : 'AM';
  const hour12 = rawHour % 12 || 12;
  const hour = String(hour12).padStart(2, '0');

  return `${day}-${month}-${year} ${hour}:${minute} ${amPm}`;
};

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
const exceptionList: Option[] = [
  { id: 'Low stoppage time', name: 'Low stoppage time' },
  { id: 'UnAuthorized', name: 'UnAuthorized' },
];
export const filterfields = (
  addaList: Option[] = [],
  franchiseList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select From Date',

    class: 'col-md-2',
  },
  {
    name: 'to',
    type: 'date',
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
    label: 'Franchise',
    placeholder: 'Select Franchise',
    options: franchiseList,
    bindLabel: 'name',
    class: 'col-md-2',
  },
  {
    name: 'exception_type',
    type: 'select',
    label: 'Exception Type',
    placeholder: 'Select Exception Type',
    options: exceptionList,
  },
];
// export const cartColumns: GridColumnConfig[] = [];
export const franchiseColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 90,
  },
  {
    headerName: 'Franchisee Name',
    field: 'FranchiseeName',
    valueGetter: (params: any) => params.data?.FranchiseeName || '-',
    minWidth: 220,
  },
  {
    headerName: 'Adda Name',
    field: 'AddaName',
    valueGetter: (params: any) => params.data?.AddaName || '-',
    minWidth: 190,
  },
  {
    headerName: 'Day Name',
    field: 'DayName',
    valueGetter: (params: any) => {
      const dayValue = params.data?.DayName;
      const normalized = String(dayValue ?? '').toUpperCase();
      return dayLabelMap[String(dayValue)] || dayLabelMap[normalized] || '-';
    },
    minWidth: 160,
  },
  {
    headerName: 'Shift Timing',
    field: 'ShiftTiming',
    valueGetter: (params: any) => params.data?.ShiftTiming || '-',
    minWidth: 180,
  },
  {
    headerName: 'Assigned No of cart',
    field: 'AssignedNoOfCart',
    valueGetter: (params: any) => params.data?.AssignedNoOfCart ?? 0,
    minWidth: 220,
  },
  {
    headerName: 'Actual No of cart',
    field: 'ActualNoOfCart',
    valueGetter: (params: any) => params.data?.ActualNoOfCart ?? 0,
    minWidth: 210,
    cellStyle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: '#1d4380',
      color: '#1d4380',
    },
    onCellClicked: (params: any) => {
      params.context?.componentParent?.openActualCart?.(params.data);
    },
  },
  {
    headerName: 'Exception Type',
    field: 'ExceptionType',
    valueGetter: (params: any) => params.data?.ExceptionType || '-',
    minWidth: 180,
  },
];
