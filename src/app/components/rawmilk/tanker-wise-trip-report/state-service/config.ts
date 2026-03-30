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
    {
        headerName: 'MPC Name',
        field: 'MpcName',
    },
    {
        headerName: 'Target Date',
        field: 'TargetDate'
    },
    {
        headerName: 'Milk Type',
        field: 'MilkType'
    },
    {
        headerName: 'Dispatch Location',
        field: 'DispatchLocation'
    },
    {
        headerName: 'Mother Dairy Received Plant',
        field: 'RPlant'
    },
    {
        headerName: 'Mapped Plant',
        field: 'Plant'
    },
    {
        headerName: 'Transporter Name',
        field: 'Transporter'
    },
    {
        headerName: 'Tanker No.',
        field: 'Tanker'
    },
    {
        headerName: 'LR No.',
        field: 'LRNumber'
    },
    {
        headerName: 'Lock Closing Time',
        valueGetter: (params: any) => {
            return params.data?.ImeiData2?.ClosingTime;
        }
    },
    {
        headerName: 'UserId',
        valueGetter: (params: any) => {
            return params.data?.ImeiData2?.Username;
        }
    },
    {
        headerName: 'No. of Chamber',
        field: 'ChmbrCnt'
    },
    {
        headerName: 'Distance',
        field: 'Distance'
    },
    {
        headerName: 'Date',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Date;
        }
    },
    {
        headerName: 'Qty.',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Qty;
        }
    },
    {
        headerName: 'FAT%',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Fat;
        }
    },
    {
        headerName: 'SNF%',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Snf;
        }
    },
    {
        headerName: 'MBRT',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Mbrt;
        }
    },
    {
        headerName: 'Temperature',
        valueGetter: (params: any) => {
            return params.data?.MilkDispatchDetails?.Temperature;
        }
    },
    {
        headerName: 'Date',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Date;
        }
    },
    {
        headerName: 'Qty.',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Qty;
        }
    },
    {
        headerName: 'FAT%',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Fat;
        }
    },
    {
        headerName: 'SNF%',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Snf;
        }
    },
    {
        headerName: 'MBRT',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Mbrt;
        }
    },
    {
        headerName: 'Temperature',
        valueGetter: (params: any) => {
            return params.data?.ActualMilkReceived?.Temperature;
        }
    },
    {
        headerName: 'Qty',
        valueGetter: (params: any) => {
            return params.data?.ActualVariations?.Qty;
        }
    },
    {
        headerName: 'FAT%',
        valueGetter: (params: any) => {
            return params.data?.ActualVariations?.Fat;
        }
    },
    {
        headerName: 'SNF%',
        valueGetter: (params: any) => {
            return params.data?.ActualVariations?.Snf;
        }
    },
    {
        headerName: 'MBRT',
        valueGetter: (params: any) => {
            return params.data?.ActualVariations?.Mbrt;
        }
    },
    {
        headerName: 'Temperature',
        valueGetter: (params: any) => {
            return params.data?.ActualVariations?.Temperature;
        }
    },
    {
        headerName: 'Dispatch Date/Time',
        valueGetter: (params: any) => {
            return params.data?.HoldTime?.DisDT;
        }
    },
    {
        headerName: 'Dispatch GPS Date/Time',
        valueGetter: (params: any) => {
            return params.data?.HoldTime?.DisGpsDT;
        }
    },
    {
        headerName: 'Reacher Plant Date/Time',
        valueGetter: (params: any) => {
            return params.data?.HoldTime?.ReachPltDT;
        }
    },
    {
        headerName: 'Gate In Date/Time',
        valueGetter: (params: any) => {
            return params.data?.HoldTime?.GateInDT;
        }
    },
    {
        headerName: 'Gate Out Date/ Time',
        valueGetter: (params: any) => {
            return params.data?.HoldTime?.GateOutDT;
        }
    },
    {
        headerName: 'Unloading Date & Time',
        field: 'UnloadAcceptDT'
    },
    {
        headerName: 'Create Date',
        field: 'DisCreateDT'
    },
    {
        headerName: 'Standard time of Arrival(HH:MM:SS)',
        field: 'STA'
    },
    {
        headerName: 'Gate Waiting Time(HH:MM:SS)',
        field: 'GateWaitTime'
    },
    {
        headerName: 'Transportation Time(HH:MM:SS)',
        field: 'TransportationTime'
    },
    {
        headerName: 'Plant TAT(HH:MM:SS)',
        field: 'PlantTAT'
    },
    {
        headerName: 'Total Plant Time(HH:MM:SS)',
        field: 'TotalPlantTime'
    },
    {
        headerName: 'R_Plant',
        field: 'RPlant'
    },
    {
        headerName: 'Procurement TAT(HH:MM:SS)',
        field: 'ProcTAT'
    },
    {
        headerName: 'In Process Time(HH:MM:SS)',
        field: 'InProcessTM'
    },
    {
        headerName: 'In Process Time - GPS(HH:MM:SS)',
        field: 'InProcessGPS'
    },
    {
        headerName: 'Alert (Yes/No)',
        field: 'Alerts'
    },
    {
        headerName: 'Rating',
        field: 'Rating'
    },
    {
        headerName: 'Indent No',
        field: 'IndentNo'
    },
    {
        headerName: 'Dispatch No',
        field: 'DispatchNo'
    },
    {
        headerName: 'Driver Details',
        valueGetter: (params: any) => {
            const name = params.data?.DriverName || '';
            const number = params.data?.DriverNumber || '';
            return name && number ? `${name} - ${number}` : name || number;
        }
    },
    {
        headerName: 'Route Distance',
        field: 'RouteDistance'
    },
    {
        headerName: 'GPS Remark',
        field: 'GpsRemark'
    },
    {
        headerName: 'Remarks (Accept/Reject)',
        field: 'Remark'
    }
]