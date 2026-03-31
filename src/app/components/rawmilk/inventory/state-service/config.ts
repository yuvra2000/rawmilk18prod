import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  GridColumnConfig,
  ActionCellRendererComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';
export const categoryList: Option[] = [
  { name: 'All', id: 'all' },
  { name: 'MCC', id: 'mcc' },
  { name: 'BMC', id: 'bmc' },
];

export const inventoryFilterFields = (
  mccList: Option[] = [],
  milkTypeList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'to',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc Name',
    placeholder: 'Select Mcc Name',
    options: mccList,
    bindLabel: 'name',
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
  },
  {
    name: 'category',
    type: 'select',
    label: 'Category',
    placeholder: 'Select Category',
    options: categoryList,
  },
];

export const inventoryTableColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => {
      return params.node.rowIndex + 1;
    },
  },
  {
    headerName: 'MCC/BMC Name',
    field: 'mcc_name',
  },
  {
    headerName: 'Date',
    field: 'date',
  },
  {
    headerName: 'Milk Type',
    field: 'milk_type',
  },
  {
    headerName: 'Quantity',
    field: 'quantity',

    type: 'numericColumn',
  },
  {
    headerName: 'FAT',
    field: 'fat',
    minWidth: 100,
    type: 'numericColumn',
  },
  {
    headerName: 'SNF',
    field: 'snf',
    minWidth: 100,
    type: 'numericColumn',
  },
  {
    headerName: 'MBRT',
    field: 'mbrt',
    minWidth: 100,
    type: 'numericColumn',
  },
  {
    headerName: 'Action',
    field: 'action',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa-solid fa-eye',
          action: 'view',
          tooltip: 'View Details',
          onClick: (data: any, node: any, params: any) => {
            if (params.context?.componentParent) {
              params.context.componentParent.onViewInventory(params.data);
            }
          },
          iconStyle: { color: colors.primary, cursor: 'pointer' },
        },
        // {
        //   icon: 'fa-solid fa-pen-to-square',
        //   action: 'edit',
        //   tooltip: 'Edit Inventory',
        //   onClick: (data: any, node: any, params: any) => {
        //     if (params.context?.componentParent) {
        //       params.context.componentParent.onEditInventory(params.data);
        //     }
        //   },
        //   iconStyle: { color: colors.warning, cursor: 'pointer' },
        // },
      ],
    },
  },
];
