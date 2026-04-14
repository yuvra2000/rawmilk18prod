import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { userType } from '../../projection/state-service/config';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
const reportTypeList: Option[] = [
  { name: 'Supplier Wise', id: 'supplier_code' },
  { name: 'Plant Wise', id: 'destination' },
];
export const filterfields = (
  milkTypeList: Option[] = [],
  supplierList: Option[] = [],
  plantList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select From Date',
    required: true,
    class: 'col-md-2',
  },
  {
    name: 'to',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select To Date',
    required: true,
    class: 'col-md-2',
  },
  {
    name: 'report',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select Report Type',
    options: reportTypeList,
    bindLabel: 'name',
    class: 'col-md-2',
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
        : 'col-md-2',
    emitValueChanges: true,
    multiple: true,
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
    class: 'col-md-2',
    multiple: true,
  },
  {
    name: 'plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: plantList,
    bindLabel: 'displayName',
    class: userType == 'Corporate Plant' ? 'd-none' : 'col-md-2',
    multiple: true,
  },
];
export function buildReportColumns(reportData: any): GridColumnConfig[] {
  const columnKeys = Array.isArray(reportData?.columns)
    ? reportData.columns.filter((key: string) => !!key)
    : Array.isArray(reportData)
      ? Object.keys(reportData[0] || {}).filter((key) => !!key)
      : Object.keys(reportData?.data?.[0] || {}).filter((key) => !!key);

  if (columnKeys.length === 0) return [];

  return [
    {
      headerName: 'SR No.',
      valueGetter: (params: any) => params.node?.rowIndex + 1,
    },
    ...columnKeys.map((col: string) => ({
      headerName: col,
      field: col,
      onCellClicked: (params: any) => {
        if (col === 'Supplier' || col === 'Plant') {
          if (params.context.componentParent) {
            params.context.componentParent.fetchDetailedReport(params);
          }
        }
      },
    })),
  ];
}
