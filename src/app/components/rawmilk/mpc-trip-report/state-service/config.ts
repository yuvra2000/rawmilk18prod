import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";
import { GridColumnConfig } from "../../../../shared/components/ag-grid/ag-grid/ag-grid.component";

export const mpcGridColumns: GridColumnConfig[] = [
  {
    headerName: 'MPC Name',
    field: 'mpcName',
    width: 150,
  },
  {
    headerName: 'MCC Name',
    field: 'mccName',
    width: 150,
  },
  {
    headerName: 'Milk Type',
    field: 'milkType',
    width: 120,
  },
  {
    headerName: 'Milk Projection (Indent)',
    children: [
      {
        headerName: 'Qty',
        field: 'milkProjection_qty',
        width: 100,
      },
      {
        headerName: 'FAT%',
        field: 'milkProjection_fat',
        width: 100,
      },
      {
        headerName: 'SNF%',
        field: 'milkProjection_snf',
        width: 100,
      },
      {
        headerName: 'MBRT',
        field: 'milkProjection_mbrt',
        width: 100,
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
      },
      {
        headerName: 'FAT%',
        field: 'milkDispatch_fat',
        width: 100,
      },
      {
        headerName: 'SNF%',
        field: 'milkDispatch_snf',
        width: 100,
      },
      {
        headerName: 'MBRT',
        field: 'milkDispatch_mbrt',
        width: 100,
      },
    ],
  },
  {
    headerName: 'Actual Milk Received',
    children: [
      {
        headerName: 'Qty',
        field: 'actualMilk_qty',
        width: 100,
      },
      {
        headerName: 'FAT%',
        field: 'actualMilk_fat',
        width: 100,
      },
      {
        headerName: 'SNF%',
        field: 'actualMilk_snf',
        width: 100,
      },
      {
        headerName: 'MBRT',
        field: 'actualMilk_mbrt',
        width: 100,
      },
    ],
  },
  {
    headerName: 'Deviation Report',
    children: [
      {
        headerName: 'Indent Qty vs Dispatch Qty',
        field: 'deviation_indentVsDispatch',
        width: 150,
      },
      {
        headerName: 'Actual-Dispatch',
        children: [
          {
            headerName: 'Qty',
            field: 'deviation_actual_qty',
            width: 100,
          },
          {
            headerName: 'FAT%',
            field: 'deviation_actual_fat',
            width: 100,
          },
          {
            headerName: 'SNF%',
            field: 'deviation_actual_snf',
            width: 100,
          },
        ],
      },
      {
        headerName: 'Remarks',
        field: 'deviation_remarks',
        width: 150,
      },
    ],
  },
];

export const statusOptions: Option[] = [
  { id: 'All', name: 'All' },
  { id: 'NO GPS', name: 'NO GPS' },
  { id: 'Active', name: 'Active' },
  { id: 'Inactive', name: 'Inactive' }
];

export const mpcFilterFields = (dispatchLocations: any[] = [], plants: any[] = []): FieldConfig[] => [
  {
    name: "fromDate",
    label: "From Date",
    type: "date",
    placeholder: "Select Date",
    required: false,
  },
  {
    name: "toDate",
    label: "To Date",
    type: "date",
    placeholder: "Select Date",
    required: false,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select Status",
    options: statusOptions,
    required: false,
  },
  {
    name: "dispatchLocation",
    label: "Dispatch Location",
    type: "select",
    placeholder: "Select Location",
    options: dispatchLocations,
    bindLabel: "name",
    required: false,
  },
  {
    name: "plant",
    label: "Plant",
    type: "select",
    placeholder: "Select Plant",
    options: plants,
    bindLabel: "name",
    required: false,
  }
];

