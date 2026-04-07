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
  { id: '', name: 'Low stoppage time' },
  { id: 'UnAuthorized', name: 'UnAuthorized' },
];
export const filterfields = (
  vehicleList: Option[] = [],
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
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
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
  {
    name: 'exception_type',
    type: 'select',
    label: 'Exception Type',
    placeholder: 'Select Exception Type',
    options: exceptionList,
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
    headerName: 'Date',
    valueGetter: (params: any) => params.data?.Date || params.data?.date || '-',
  },
  {
    headerName: 'Franchise Name',
    valueGetter: (params: any) =>
      params.data?.FranchiseeName || params.data?.franchisee_name || '-',
  },
  {
    headerName: 'Adda Name',
    valueGetter: (params: any) =>
      params.data?.AddaName || params.data?.adda_name || '-',
  },
  {
    headerName: 'Cart Number',
    valueGetter: (params: any) =>
      params.data?.CartNumber ||
      params.data?.cart_no ||
      params.data?.cart_number ||
      '-',
  },
  {
    headerName: 'Day Name',
    valueGetter: (params: any) => {
      const dayValue = params.data?.DayName ?? params.data?.day;
      if (dayValue === undefined || dayValue === null || dayValue === '') {
        return '-';
      }
      const dayKey = String(dayValue).toUpperCase();
      return dayLabelMap[dayKey] || String(dayValue);
    },
  },
  {
    headerName: 'Shift Timing',
    valueGetter: (params: any) =>
      params.data?.ShiftTiming || params.data?.shift_timing || '-',
  },
  {
    headerName: 'Arrival Time',
    valueGetter: (params: any) =>
      formatDateTime(params.data?.ArrivalTime || params.data?.arrival_time),
  },
  {
    headerName: 'Departure Time',
    valueGetter: (params: any) =>
      formatDateTime(params.data?.DepartureTime || params.data?.departure_time),
  },
  {
    headerName: 'Duration',
    valueGetter: (params: any) =>
      params.data?.Duration || params.data?.duration || '-',
  },
  {
    headerName: 'Exception Type',
    valueGetter: (params: any) =>
      params.data?.ExceptionType || params.data?.exception_type || '-',
  },
];
