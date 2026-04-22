import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const cartWiseFilterFields: FieldConfig[] = [
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
    width: 80,
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

/**
 * ADDA-WISE REPORT COLUMNS
 * Displays: S.No, Vehicle No, Transporter, Blacklisted Date, Whitelisted Date, Current Status, Remark, Action
 */
export const addaWiseColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    sortable: true,
  },
  {
    headerName: 'Vehicle No',
    field: 'vehicleNo',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Transporter',
    field: 'transporter',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Blacklisted Date',
    field: 'blacklistedDate',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Whitelisted Date',
    field: 'whitelistedDate',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Current Status',
    field: 'currentStatus',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Remark',
    field: 'remark',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Action',
    field: 'action',
    width: 100,
    sortable: false,
    filter: false,
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa-solid fa-pen-to-square',
          tooltip: 'Edit',
          onClick: (data: any, node: any, params: any) => {
            if (params.context?.componentParent) {
              params.context.componentParent.onEdit(data);
            }
          },
          iconStyle: { color: colors.primary, cursor: 'pointer' },
        },
        {
          icon: 'fa fa-eye',
          tooltip: 'View',
          onClick: (data: any, node: any, params: any) => {
            if (params.context?.componentParent) {
              params.context.componentParent.onView(data);
            }
          },
          iconStyle: {
            color: 'grey',
            cursor: 'pointer',
            fontSize: '18px',
            marginRight: '10px',
          },
        },
      ],
    },
  },
];
