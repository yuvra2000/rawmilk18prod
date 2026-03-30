import { GridColumnConfig } from "../../../../shared/components/ag-grid/ag-grid/ag-grid.component";
import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";

const statusList: Option[] = [
    { id: 'No GPS', name: 'No GPS' },
    { id: 'Active', name: 'Active' },
    { id: 'In Active', name: 'In Active' }
];

const triggerList: Option[] = [
    { id: 'All', name: 'All' }
]

const transporterList: Option[] = [
    { id: 'All', name: 'All' }
]

const remarkList: Option[] = [
    { id: 'All', name: 'All' },
    { id: 'ACCEPT', name: 'Accept' },
    { id: 'REJECT', name: 'Reject' }
]

const reportTypeList: Option[] = [
    { id: 'All', name: 'All' },
    { id: 1, name: 'Standard' },
    { id: 2, name: 'Detailed' }
]

export const tankerWiseTripReportFilterField = (tankerName: Option[] = [], plantName: Option[] = [], mpcName: Option[] = [], mccName: Option[] = []): FieldConfig[] => [
    {
        name: 'from',
        label: 'From Date',
        type: 'date',
        placeholder: 'Select Date'
    },
    {
        name: 'to',
        label: 'To Date',
        type: 'date',
        placeholder: 'Select Date'
    },
    {
        name: 'tanker',
        label: 'Tanker',
        type: 'select',
        placeholder: '--Select--',
        options: tankerName,
        bindLabel: 'VehicleNo'
    },
    {
        name: 'mpcName',
        label: 'MPC Name',
        type: 'select',
        placeholder: '--Select--',
        options: mpcName,
        bindLabel: 'displayName'
    },
    {
        name: 'plant',
        label: 'Plant',
        type: 'select',
        placeholder: '--Select--',
        options: plantName,
        bindLabel: 'displayName'
    },
    {
        name: 'mccName',
        label: 'MCC Name',
        type: 'select',
        placeholder: '--Select--',
        options: mccName,
        bindLabel: 'displayName'
    },
    {
        name: 'identNumber',
        label: 'Ident Number',
        type: 'number',
        placeholder: 'Ident Number'
    },
    {
        name: 'dispatchNumber',
        label: 'Dispatch Number',
        type: 'number',
        placeholder: 'Dispatch Number'
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        placeholder: '--Select--',
        options: statusList,
        bindLabel: 'name'
    },
    {
        name: 'trigger',
        label: 'Trigger',
        type: 'select',
        placeholder: '--Select--',
        options: triggerList,
        bindLabel: 'name'
    },
    {
        name: 'transporter',
        label: 'Transporter',
        type: 'select',
        placeholder: '--Select--',
        options: transporterList,
        bindLabel: 'name'
    },
    {
        name: 'remark',
        label: 'Remark',
        type: 'select',
        placeholder: '--Select--',
        options: remarkList,
        bindLabel: 'name'
    },
    {
        name: 'reportType',
        label: 'Report Type',
        type: 'select',
        placeholder: '--Select--',
        options: reportTypeList,
        bindLabel: 'name'
    }
]

export const tankerWiseTripReportGridColumn: GridColumnConfig[] = [

]