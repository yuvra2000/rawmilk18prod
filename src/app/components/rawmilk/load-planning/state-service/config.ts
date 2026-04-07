import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";
import { GridColumnConfig } from "../../../../shared/components/ag-grid/ag-grid/ag-grid.component";

export const filterFields = (
    transporterList: Option[] = [],
    vehicleList: Option[] = [],
    dispatchLocationList: Option[] = [],
    destinationList: Option[] = []
): FieldConfig[] => [
    {
        name: "vehicleNo",
        label: "Vehicle No.",
        type: "select",
        placeholder: "--Select--",
        options: vehicleList,
        bindLabel: "VehicleNo"
    },
    {
        name: "transporter",
        label: "Transporter",
        type: "select",
        placeholder: "--Select--",
        options: transporterList,
        bindLabel: "TransporterName"
    },
    {
        name: "dispatchLocation",
        label: "Dispatch Location",
        type: "select",
        placeholder: "--Select--",
        options: dispatchLocationList,
        bindLabel: "displayName"
    },
    {
        name: "destination",
        label: "Destination",
        type: "select",
        placeholder: "--Select--",
        options: destinationList,
        bindLabel: "displayName"
    },
    {
        name: "currentStatus",
        label: "Current Status",
        type: "select",
        placeholder: "--Select--",
        options: [
            { id: "", name: "All" },
            { id: "LOADED", name: "Loaded" },
            { id: "BREAKDOWN", name: "Break Down" },
            { id: "NOTAVAIL", name: "Not Available" },
            { id: "VACANT", name: "Vacant" },
            { id: "ASSIGNED", name: "Assigned" }
        ]
    },
    {
        name: "vehicleStatus",
        label: "Vehicle Status",
        type: "select",
        placeholder: "--Select--",
        options: [
            { id: "", name: "All" },
            { id: "ACTIVE", name: "Active" },
            { id: "INACTIVE", name: "InActive" }
        ]
    }
];
export const loadPlanningColumns: GridColumnConfig[] = [
    { headerName: 'S.No.', field: 'serialNo', valueGetter: (params: any) => params.node.rowIndex + 1, width: 80, pinned: 'left' },
    { headerName: 'Vehicle No.', field: 'VehicleNum' },
    { headerName: 'Last Dispatch Date', field: 'LastDisDate' },
    { headerName: 'Last Dispatch Plant', field: 'Destination' },
    { headerName: 'Last Dispatch close Date', field: 'LastDisCloseDate' },
    { headerName: 'Source', field: 'Source' },
    { headerName: 'Destination', field: 'Destination' },
    { headerName: 'Current Status', field: 'CurrentStatus' },
    { headerName: 'Action', field: 'action' }
];
