import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { colors } from '../../../../shared/utils/constants';
export const viewIndentSupplierFilterFields: FieldConfig[] = [
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
    name: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: [
      { name: 'All', id: '' },
      { name: 'Unallocated', id: 'Un-Allocated' },
      { name: 'Allocated', id: 'Allocated' },
      { name: 'Indent With MCC', id: 'IndentWithMcc' },
      { name: 'Cancelled', id: 'cancel' },
    ],
  },
  {
    name: 'reportType',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select Report Type',
    options: [
      { name: 'Standard', id: 'Standard' },
      { name: 'Detailed', id: 'Detailed' },
    ],
  },
];
export const editFields: FieldConfig[] = [
  {
    name: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter Quantity',
    required: true,
  },
];
export const closeIntentField: FieldConfig[] = [
  {
    name: 'remark',
    type: 'text',
    label: 'Remark',
    placeholder: 'Enter Remark',
    required: true,
  },
];
export const uploadIntentFields: FieldConfig[] = [
  {
    name: 'upload',
    type: 'file-upload',
    label: 'Upload',
    placeholder: 'Choose File',
    required: true,
    class: 'col-md-12',
    uploadMode: 'file',
    accept: '.xlsx, .xls',
    uploadText: 'Upload Excel File',
    displayMode: 'modal-form',
  },
];
export const addIntentFields: FieldConfig[] = [
  {
    name: 'targetDate',
    type: 'date',
    label: 'Target Date',
    placeholder: 'dd-mm-yyyy',
    required: true,
    class: 'col-md-6',
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    // required: true,
    class: 'col-md-6',
    options: [], // To be populated dynamically
  },
  {
    name: 'toPlant',
    type: 'select',
    label: 'To Plant',
    placeholder: 'Select Plant',
    // required: true,
    class: 'col-md-6',
    options: [], // To be populated dynamically
  },
  {
    name: 'fat',
    type: 'text',
    label: 'Fat',
    placeholder: 'Enter Fat',
    required: false,
    class: 'col-md-6',
  },
  {
    name: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter Quantity',
    // required: true,
    class: 'col-md-6',
  },
  {
    name: 'snf',
    type: 'text',
    label: 'SNF',
    placeholder: 'Enter SNF',
    required: false,
    class: 'col-md-6',
  },
  {
    name: 'fromSupplierPlant',
    type: 'select',
    label: 'From Supplier/Plant',
    placeholder: 'Select Supplier/Plant',
    // required: true,
    class: 'col-md-6',
    emitValueChanges: true,
    options: [],
  },
  {
    name: 'mbrt',
    type: 'text',
    label: 'MBRT',
    placeholder: 'Enter MBRT',
    required: false,
    class: 'col-md-6',
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc (Optional)',
    placeholder: 'Select Mcc',
    required: false,
    class: 'col-md-6',
  },
  {
    name: 'repeatIndent',
    type: 'number',
    label: 'Repeat Indent',
    placeholder: '0',
    required: false,
    class: 'col-md-6',
  },
];
// ...existing code...
export const viewIndentSupplierGridColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Indent/Plant',
    field: 'indent_no',
  },
  {
    headerName: 'Target Date',
    field: 'target_date',
  },
  {
    headerName: 'Plant',
    field: 'plant_name',
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
  },
  {
    headerName: 'Unallocated Quantity',
    field: 'unallocated_quantity',
    valueGetter: (params: any) => {
      const quantity = parseInt(params.data.quantity) || 0;
      const allocated = parseInt(params.data.allocated_quantity) || 0;
      return quantity - allocated;
    },
  },
  {
    headerName: 'Dispatch Created',
    field: 'dispatchCreated',
  },
  {
    headerName: 'No. of Dispatches',
    field: 'noOfDispatch',
  },
  {
    headerName: 'Supplier',
    field: 'supplier_name',
  },
  {
    headerName: 'Mcc',
    field: 'mcc_name',
  },
  {
    headerName: 'Milk Type',
    field: 'milk_type_name',
  },
];

export const actionColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      {
        icon: 'fa-solid fa-pen-to-square',
        action: 'edit',
        tooltip: 'Edit Indent',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onEditIndent(params.data);
          }
        },
        iconStyle: { color: colors.primary, cursor: 'pointer' },
      },
      {
        icon: 'fa-solid fa-eye',
        action: 'view',
        tooltip: 'View Indent',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onViewIndent(params.data);
          }
        },
        iconStyle: { color: colors.primary, cursor: 'pointer' },
      },
    ],
  },
};
