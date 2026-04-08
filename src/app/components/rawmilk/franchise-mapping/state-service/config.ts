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

export const franchiseMappingColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'sNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Franchise Code',
    field: 'franchise_code',
  },
  {
    headerName: 'Adda code',
    field: 'adda_code',
    headerTooltip: 'Adda code',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Create Date',
    field: 'create_date',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Status',
    field: 'status',
    minWidth: 140,
    valueGetter: (params: any) =>
      Number(params.data?.status) == 1 ? 'Assign' : 'Deassign',
    cellRenderer: StatusCellRendererComponent,
    cellRendererParams: {
      status: (params: any) =>
        Number(params?.data?.status) == 1 ? 'active' : 'inactive',
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
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
