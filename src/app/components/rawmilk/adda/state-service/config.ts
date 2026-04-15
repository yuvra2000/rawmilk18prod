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

export const addaColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 90,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Adda Name',
    field: 'name',
    minWidth: 200,
  },
  {
    headerName: 'Adda code',
    field: 'code',
    width: 100,
    headerTooltip: 'Adda code',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Cords',
    field: 'latlng',
    minWidth: 320,
  },
  {
    headerName: 'Region',
    field: 'region_code',
    minWidth: 140,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Status',
    field: 'status',
    minWidth: 140,
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
export const editFields = (regionList: any[]): FieldConfig[] => [
  {
    name: 'name',
    type: 'text',
    label: 'Edit Adda Name',
    placeholder: 'Enter Adda Name',
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
    name: 'latlng',
    type: 'text',
    label: 'Geo Coordinates',
    required: true,
  },
  {
    name: 'region_code',
    type: 'select',
    label: 'Region',
    placeholder: 'Select Region',
    options: regionList,
    required: true,
  },
  {
    name: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select Status',
    options: statusList,
  },
];
export const addFields = (regionList: any[]): FieldConfig[] => [
  {
    name: 'name',
    type: 'text',
    label: 'Adda Name',
    placeholder: 'Enter Adda Name',
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
  {
    name: 'latlng',
    type: 'text',
    label: 'Geo Coordinates',
    required: true,
    placeholder: 'Lat,Lng',
  },
  {
    name: 'region_code',
    type: 'select',
    label: 'Region',
    placeholder: 'Select Region',
    options: regionList,
    required: true,
  },
];
