import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

export const otherStoppageFilterFields = (
  vehicleList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    label: 'From Date',
    type: 'datetime',
    // required: true,
    maxDate: -1,
  },
  {
    name: 'to',
    label: 'To Date',
    type: 'datetime',
    // required: true,
    maxDate: -1,
  },
  {
    name: 'cart_no',
    label: 'Cart Number',
    type: 'select',
    // required: true,
    multiple: true,
    options: vehicleList,
  },
];
// export const cartColumns: GridColumnConfig[] = [];
export const stoppageReportColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 70,
  },
  {
    headerName: 'Stoppage Name',
    field: 'stoppage_name',
  },
  {
    headerName: 'Lat Long',
    field: 'latlong',
  },
  // {
  //   headerName: 'Latitude',
  //   field: 'latitude',
  //   width: 120,
  // },
  // {
  //   headerName: 'Longitude',
  //   field: 'longitude',
  //   width: 120,
  // },
  {
    headerName: 'Cart No',
    field: 'cart_no',
  },
  {
    headerName: 'Start Time',
    field: 'start_time',
  },
  {
    headerName: 'End Time',
    field: 'end_time',
  },
];
