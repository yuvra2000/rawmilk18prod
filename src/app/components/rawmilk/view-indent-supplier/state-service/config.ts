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
];
export const viewIndentSupplierGridColumnsIfNotChillingPlant: FieldConfig[] = [
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
const usertype = localStorage.getItem('usertype');
const isChillingPlant = usertype == 'ChillingPlant';
const isSupplier = usertype == 'Supplier';
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
  ...(isSupplier
    ? [
        {
          headerName: 'Unallocated Quantity',
          field: 'unallocated_quantity',
          valueGetter: (params: any) => {
            const quantity = parseInt(params.data.quantity) || 0;
            const allocated = parseInt(params.data.allocated_quantity) || 0;
            return quantity - allocated;
          },
        },
      ]
    : []),
  ...(isChillingPlant
    ? [
        {
          headerName: 'Remaining Quantity',
          field: 'RemaingQuantity',
        },
      ]
    : []),
  {
    headerName: 'Dispatch Created',
    field: 'dispatchCreated',
  },
  {
    headerName: 'No. of Dispatches',
    field: 'noOfDispatch',
    cellRenderer: (params: any) => {
      const count = params.data.noOfDispatch || 0;
      const span = document.createElement('span');
      span.innerText = count;
      span.style.color = colors.primary;
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.onViewDispatches(params.data);
        }
      });
      return span;
    },
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
      // ✅ View Intent - when action_type == 3
      {
        icon: 'fa fa-eye',
        action: 'view',
        tooltip: 'View',
        visible: (data: any) => data?.action_type == 3,
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.veiwindent(data.id);
          }
        },
        iconStyle: {
          color: 'grey',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Edit Intent - when usertype == 'Supplier' && sub_indent == 1
      {
        icon: 'fa fa-pencil-square-o',
        action: 'edit',
        tooltip: 'Edit',
        visible: (data: any, params: any) =>
          params?.context?.componentParent?.usertype() === 'Supplier' &&
          data?.sub_indent == 1,
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.fetchindetvalue(
              data.id,
              data.quantity,
              'Edit',
            );
          }
        },
        iconStyle: {
          color: colors.primary,
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Allocate - when action_type == 1
      {
        icon: 'fa fa-bars',
        action: 'allocate',
        tooltip: 'Allocate',
        visible: (data: any) => data?.action_type == 1,
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.fetchindetvalue(
              data.id,
              data.quantity,
              'New',
            );
          }
        },
        iconStyle: {
          color: colors.primary,
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Create Dispatch - when action_type == 2
      {
        icon: 'fe fe-truck',
        action: 'createDispatch',
        tooltip: 'Create Dispatch',
        visible: (data: any) => {
          debugger;
          return data?.action_type == 2;
        },
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.Create_dis(
              data.id,
              data.target_date,
            );
          }
        },
        iconStyle: {
          color: 'green',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
      // ✅ Dispatch Already Created - when action_type == 0 (disabled)
      {
        icon: 'fe fe-truck',
        action: 'dispatchCreated',
        tooltip: 'Dispatch Already created',
        visible: (data: any) => data?.action_type == 0,
        onClick: () => {}, // No action - just display
        iconStyle: {
          color: 'green',
          cursor: 'not-allowed',
          fontSize: '18px',
          marginRight: '10px',
          opacity: 0.6,
        },
      },
    ],
  },
};
