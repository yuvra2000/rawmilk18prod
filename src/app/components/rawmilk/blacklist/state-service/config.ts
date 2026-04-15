import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const reportTypeList: Option[] = [
  { id: '1', name: 'Vehiclewise' },
  { id: '2', name: 'Transporter Wise' },
];

const statusList: Option[] = [
  { id: 'All', name: 'All' },
  { id: 'Blacklist', name: 'Blacklisted' },
  { id: 'Whitelist', name: 'Whitelisted' },
];

export const filterfields = (
  vehicleList: Option[] = [],
  transporterList: Option[] = [],
  reportType: any,
): FieldConfig[] => [
  {
    name: 'reportType',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select Report Type',
    options: reportTypeList,
    class: 'col-md-2',
    emitValueChanges: true,
  },
  {
    name: 'Vehicles',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Vehicle',
    options: vehicleList,
    class: reportType == '1' ? 'col-md-2' : 'd-none',
    multiple: true,
    showSelectAll: true,
  },
  {
    name: 'Transporters',
    type: 'select',
    label: 'Transporter',
    placeholder: 'Select Transporter',
    options: transporterList,
    class: reportType == '2' ? 'col-md-2' : 'd-none',
    multiple: true,
    showSelectAll: true,
  },
  {
    name: 'Type',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: statusList,
  },
];

/**
 * VEHICLE-WISE REPORT COLUMNS
 * Displays: S.No, Vehicle No, Transporter, Blacklisted Date, Whitelisted Date, Current Status, Remark, Action
 */
export const vehiclewiseColumns: GridColumnConfig[] = [
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

/**
 * TRANSPORTER-WISE REPORT COLUMNS
 * Displays: S.No, Transporter, No of vehicles, No of Blacklisted vehicles, Action
 */
export const transporterwiseColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    sortable: true,
  },
  {
    headerName: 'Transporter',
    field: 'transporter',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'No of vehicles',
    field: 'noOfVehicles',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'No of Blacklisted vehicles',
    field: 'noOfBlacklistedVehicles',

    sortable: true,
    filter: true,
  },
  {
    headerName: 'Action',
    field: 'action',

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
