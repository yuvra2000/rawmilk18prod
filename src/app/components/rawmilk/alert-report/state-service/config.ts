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
        headerName: 'Alert Type',
        field: 'AlertType',
    },
    {
        headerName: 'Vehicle No.',
        field: 'VehicleNumber',
    },
    {
        headerName: 'Dispatch No.',
        field: 'DispatchNo',
    },
    {
        headerName: 'Dispatch Date',
        field: 'DispatchDate'
    },
    {
        headerName: 'Plant',
        field: 'PlantName'
    },
    {
        headerName: 'MPC',
        field: 'MpcName'
    },
    {
        headerName: 'MCC',
        field: 'MccName'
    },
    {
        headerName: 'Start Time',
        field: 'StartTime'
    },
    {
        headerName: 'End Time',
        field: 'EndTime'
    },
    {
        headerName: 'Duration',
        field: 'Duration'
    }
]