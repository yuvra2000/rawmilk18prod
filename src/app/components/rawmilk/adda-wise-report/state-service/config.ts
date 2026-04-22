import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

export const addaWiseFilterFields: FieldConfig[] = [
  {
    name: 'from',
    label: 'From Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
  {
    name: 'to',
    label: 'To Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
];

/**
 * Cart detail columns for modal display
 */
export const cartDetailColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node?.rowIndex + 1,
    width: 120,
  },
  {
    headerName: 'Cart No',
    field: 'cart_no',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Start Time',
    field: 'cart_start_time',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'End Time',
    field: 'cart_end_time',
    sortable: true,
    filter: true,
  },
];
