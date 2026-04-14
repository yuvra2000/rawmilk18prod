import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";
import { GridColumnConfig } from "../../../../shared/components/ag-grid/ag-grid/ag-grid.component";

const statusOptions: Option[] = [
  { id: "All", name: "All" },
  { id: "NO GPS", name: "NO GPS" },
  { id: "Active", name: "Active" },
  { id: "Inactive", name: "Inactive" },
];

export const indentTripGridColumns: GridColumnConfig[] = [
  {
    headerName: '',
    field: '__toggle',
    width: 70,
    pinned: 'left',
    lockPinned: true,
    suppressMovable: true,
    sortable: false,
    filter: false,
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    cellRenderer: (params: any) => {
      if (params.data?.__rowType !== 'summary') {
        return '';
      }
      return `<button type="button" class="btn btn-sm btn-outline-primary">${params.data?.__expanded ? '-' : '+'}</button>`;
    },
    onCellClicked: (params: any) => {
      if (params.data?.__rowType === 'summary') {
        params.context?.componentParent?.toggleRow(params.data.__rowId);
      }
    },
  },
  {
    headerName: 'MPC Name',
    field: 'mpcName',
    minWidth: 200,
    pinned: 'left',
  },
  {
    headerName: 'Mother Dairy Received Plant',
    field: 'motherDairyPlant',
    minWidth: 220,
    pinned: 'left',
  },
  {
    headerName: 'Milk Type',
    field: 'milkType',
    width: 120,
    pinned: 'left',
  },
  {
    headerName: 'Indent No.',
    field: 'indentNo',
    width: 140,
  },
  {
    headerName: 'Indent Date',
    field: 'indentDate',
    width: 140,
  },
  {
    headerName: 'Dispatch Date',
    field: 'dispatchDate',
    width: 140,
  },
  {
    headerName: 'Dispatch Location',
    field: 'dispatchLocation',
    minWidth: 180,
  },
  {
    headerName: 'Milk Projection (Indent)',
    children: [
      { 
        headerName: 'Qty', 
        field: 'milkProjection_qty', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'FAT%', 
        field: 'milkProjection_fat', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'Snf%', 
        field: 'milkProjection_snf', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'MBRT', 
        field: 'milkProjection_mbrt', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
    ],
  },
  {
    headerName: 'Milk Dispatch Details',
    children: [
      { 
        headerName: 'Qty', 
        field: 'milkDispatch_qty', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'FAT%', 
        field: 'milkDispatch_fat', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'Snf%', 
        field: 'milkDispatch_snf', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'MBRT', 
        field: 'milkDispatch_mbrt', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
    ],
  },
  {
    headerName: 'Actual Milk Received Details',
    children: [
      { 
        headerName: 'Qty', 
        field: 'actualMilk_qty', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'FAT%', 
        field: 'actualMilk_fat', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'Snf%', 
        field: 'actualMilk_snf', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
      { 
        headerName: 'MBRT', 
        field: 'actualMilk_mbrt', 
        width: 100,
        valueFormatter: (params: any) => params.value ?? 0
      },
    ],
  },
  {
    headerName: 'Deviation Report',
    children: [
      {
        headerName: 'Indent Qty vs Dispatch Qty',
        field: 'deviation_indentVsDispatch',
        width: 180,
        valueFormatter: (params: any) => params.value ?? 0
      },
      {
        headerName: 'Actual- Dispatch',
        children: [
          { 
            headerName: 'Qty.', 
            field: 'deviation_actual_qty', 
            width: 100,
            valueFormatter: (params: any) => params.value ?? 0
          },
          { 
            headerName: 'FAT%', 
            field: 'deviation_actual_fat', 
            width: 100,
            valueFormatter: (params: any) => params.value ?? 0
          },
          { 
            headerName: 'SNF%', 
            field: 'deviation_actual_snf', 
            width: 100,
            valueFormatter: (params: any) => params.value ?? 0
          },
        ],
      },
      {
        headerName: 'Remarks',
        field: 'deviation_remarks',
        minWidth: 180,
      },
    ],
  },
];

export const indentTripFilterFields = (
  mpcNameList: Option[] = [],
  plantList: Option[] = [],
  dispatchLocationList: Option[] = [],
  milkTypeList: Option[] = []
): FieldConfig[] => [
  {
    name: "fromDate",
    type: "date",
    label: "From Date",
    placeholder: "Select Date",
    required: false,
  },
  {
    name: "toDate",
    type: "date",
    label: "To Date",
    placeholder: "Select Date",
    required: false,
  },
  {
    name: "indentNo",
    type: "text",
    label: "Indent No",
    placeholder: "Enter Indent No",
    required: false,
  },
  {
    name: "mpcName",
    type: "select",
    label: "MPC Name",
    placeholder: "--Select--",
    options: mpcNameList,
    bindLabel: "name",
    required: false,
  },
  {
    name: "plant",
    type: "select",
    label: "Plant",
    placeholder: "--Select--",
    options: plantList,
    bindLabel: "name",
    required: false,
  },
  {
    name: "dispatchLocation",
    type: "select",
    label: "Dispatch Location",
    placeholder: "--Select--",
    options: dispatchLocationList,
    bindLabel: "name",
    required: false,
  },
  {
    name: "status",
    type: "select",
    label: "Status",
    placeholder: "--Select--",
    options: statusOptions,
    bindLabel: "name",
    required: false,
  },
  {
    name: "milkType",
    type: "select",
    label: "Milk Type",
    placeholder: "--Select--",
    options: milkTypeList,
    bindLabel: "displayName",
    required: false,
  },
];
