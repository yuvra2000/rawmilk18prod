import {
  ActionCellRendererComponent,
  GridColumnConfig,
  StatusCellRendererComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { colors } from '../../../../shared/utils/constants';

export const franchiseColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Franchise Name',
    field: 'name',
  },
  {
    headerName: 'Franchise code',
    field: 'code',
    headerTooltip: 'Franchise code',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Status',
    field: 'status',
    valueGetter: (params: any) =>
      Number(params.data?.status) === 1 ? 'Active' : 'Deactive',
    cellRenderer: StatusCellRendererComponent,
    cellRendererParams: {
      status: (params: any) =>
        Number(params?.data?.status) === 1 ? 'active' : 'inactive',
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Action',
    field: 'action',
    minWidth: 120,
    maxWidth: 140,
    pinned: 'right',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa-solid fa-pen-to-square',
          tooltip: 'Edit',
          onClick: (data: any, node: any, params: any) => {
            const parent = params?.context?.componentParent;
            if (parent && typeof parent.onEdit === 'function') {
              parent.onEdit(data);
            }
          },
          iconStyle: {
            color: colors.primary,
            cursor: 'pointer',
            fontSize: '16px',
          },
        },
      ],
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
    sortable: false,
    filter: false,
  },
];
const statusList: Option[] = [
  { name: 'Active', id: 1 },
  { name: 'Deactive', id: 2 },
];
export const editFields = (): FieldConfig[] => [
  {
    name: 'name',
    type: 'text',
    label: 'Edit Franchise Name',
    placeholder: 'Enter Franchise Name',
  },
  {
    name: 'code',
    type: 'text',
    label: 'Code',
    disabled: true,
  },
  {
    name: 'inchargeName',
    type: 'text',
    label: 'Incharge Name',
    placeholder: 'Incharge Name',
  },
  {
    name: 'inchargeContact',
    type: 'text',
    label: 'Incharge Contact',
    placeholder: 'Incharge Contact',
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: statusList,
  },
];
export const addFields = (): FieldConfig[] => [
  {
    name: 'name',
    type: 'text',
    label: 'Franchise Name',
    placeholder: 'Enter Franchise Name',
  },
  {
    name: 'code',
    type: 'text',
    label: 'Code',
    placeholder: 'Code',
  },
  {
    name: 'inchargeName',
    type: 'text',
    label: 'Incharge Name',
    placeholder: 'Incharge Name',
  },
  {
    name: 'inchargeContact',
    type: 'text',
    label: 'Incharge Contact',
    placeholder: 'Incharge Contact',
  },
];
