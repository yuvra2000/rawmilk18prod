import { GridColumnConfig } from "../../../../shared/components/ag-grid/ag-grid/ag-grid.component";
import { FieldConfig, Option } from "../../../../shared/components/filter-form/shared/types";

const alertTypeOptions: Option[] = [
    { id: 1, name: 'S30' },
    { id: 2, name: 'LId' }
];

export const reportAlertReportFilterField = (mpcName: Option[] = []): FieldConfig[] => [
    {
        name: 'from',
        label: 'From Date',
        type: 'date',
        placeholder: 'Select Date',
    },
    {
        name: 'to',
        label: 'To Date',
        type: 'date',
        placeholder: 'Select Date',
    },
    {
        name: 'mpcName',
        label: 'MPC Name',
        type: 'select',
        placeholder: '--Select--',
        options: mpcName
    },
    {
        name: 'alertType',
        label: 'Alert Type',
        type: 'select',
        placeholder: '--Select--',
        options: alertTypeOptions,
    },
];

export const alertReportGridColumns: GridColumnConfig[] = [
    {
        headerName: 'Indent/Plant',
        field: 'indent_no',
    }
]