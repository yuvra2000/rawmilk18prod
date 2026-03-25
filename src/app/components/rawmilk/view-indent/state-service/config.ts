import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
export const viewIndentFilterFields: FieldConfig[] = [
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
// ...existing code...
export const viewIndentGridColumns: GridColumnConfig[] = [
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
  {
    headerName: 'Action',
    field: 'action',
    cellRenderer: 'actionRenderer',
  },
];
