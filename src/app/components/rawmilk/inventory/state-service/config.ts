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

const userType = localStorage.getItem('usertype') || '';
export const inventoryFilterFields = (
  mccList: Option[] = [],
  milkTypeList: Option[] = [],
  supplierList: Option[] = [],
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
    name: 'supplier',
    type: 'select',
    label: 'Supplier Name',
    placeholder: 'Select Supplier Name',
    options: supplierList,
    bindLabel: 'displayName',
    class:
      userType == 'Supplier' || userType == 'ChillingPlant'
        ? 'd-none'
        : 'col-md-2', // Hide for suppliers, show for others
    emitValueChanges: true,
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc Name',
    placeholder: 'Select Mcc Name',
    options: mccList,
    bindLabel: 'name',
    class: userType == 'ChillingPlant' ? 'd-none' : 'col-md-2', // Hide for MCC users, show for others
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
export const addInventory: FieldConfig[] = [
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    required: true,
    class: 'col-md-6',
    disabled: true,
  },
  {
    name: 'mcc',
    label: 'MCC/BMC Name',
    type: 'select',
    required: true,
    class: 'col-md-6',
    options: [],
  },
  {
    name: 'milkSamples',
    label: 'Milk Sample',
    type: 'formarray',
    required: true,
    class: 'col-12',
    minItems: 1, // Minimum 1 item must be present

    addButtonText: 'Add Milk Sample',
    removeButtonText: 'Remove Sample',
    formArrayFields: [
      {
        name: 'milkType',
        label: 'Milk Type',
        type: 'select',
        required: true,
        class: 'col-md-3',
        options: [
          { id: 'cow', name: 'Cow Milk' },
          { id: 'buffalo', name: 'Buffalo Milk' },
          { id: 'mixed', name: 'Mixed Milk' },
        ],
      },
      {
        name: 'quantity',
        label: 'Quantity (L)',
        type: 'number',
        required: true,
        min: 0.1,
        class: 'col-md-2',
        placeholder: 'Enter Quantity',
      },
      {
        name: 'fat',
        label: 'Fat %',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        class: 'col-md-2',
        placeholder: 'Enter Fat %',
      },
      {
        name: 'snf',
        label: 'SNF %',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        class: 'col-md-2',
        placeholder: 'Enter SNF %',
      },
      {
        name: 'mbrt',
        label: 'MBRT',
        type: 'text',
        required: false,
        class: 'col-md-3',
        placeholder: 'Enter MBRT',
      },
    ],
  },
];
