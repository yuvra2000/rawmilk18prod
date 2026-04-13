import {
  GridColumnConfig,
  StatusCellRendererComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';

export const cartMappingColumns: GridColumnConfig[] = [
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
    headerName: 'Vehicle No',
    field: 'vehicle_no',
    headerTooltip: 'Vehicle Number',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Status',
    field: 'status',
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
export const assignCartFields = (
  franchiseList: any[],
  cartList: any[],
): FieldConfig[] => [
  {
    name: 'franchise_code',
    type: 'select',
    label: 'Franchise',
    placeholder: 'Select Franchise',
    options: franchiseList,
    required: true,
  },
  {
    name: 'vehicle_no',
    type: 'select',
    label: 'Cart',
    placeholder: 'Select Cart',
    options: cartList,
    required: true,
  },
];
