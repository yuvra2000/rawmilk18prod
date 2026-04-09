import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const vehicleDocumentColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  { headerName: 'Vehicle Number', field: 'VehicleNumber' },
  { headerName: 'Document Type', field: 'DocumentTypeName' },
  { headerName: 'Document Number', field: 'DocumentNo' },
  { headerName: 'Issue Date', field: 'IssueDate' },
  { headerName: 'Expiry Date', field: 'ExpiryDate' },
  { headerName: 'Transporter', field: 'Transporter' },
  { headerName: 'Supplier', field: 'Supplier' },
  { headerName: 'Document File', field: 'DocumentNo' },
  { headerName: 'Driver', field: 'DriverName' },
  { headerName: 'Remarks', field: 'Remark' },
  { headerName: 'Status', field: 'Status' },
  { headerName: 'Image', field: 'FilePath', hide: true}
];

export const actionColumn: GridColumnConfig = {
  headerName: 'View Image',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      {
        icon: 'fa fa-eye',
        tooltip: 'View Image',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            // Pass the FilePath directly to the parent component's method handling the modal
            params.context.componentParent.onView(data.FilePath);
          }
        },
        iconStyle: {
          color: 'grey',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
    ],
  },
};

export const editColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'editAction',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      {
        icon: 'fa fa-edit',
        tooltip: 'Edit Document For Vehicle',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onEdit(data);
          }
        },
        iconStyle: {
          color: '#214376',
          cursor: 'pointer',
          fontSize: '18px',
        },
      },
    ],
  },
};

export const editVehicleDocumentFields = (
  documentTypes: Option[] = [],
  vehicles: Option[] = []
): FieldConfig[] => [
  {
    name: "vehicle",
    label: "Vehicle Number",
    type: "select",
    placeholder: "Select Vehicle",
    options: vehicles,
    bindLabel: "VehicleNum",
    required: true,
    class: "col-md-12"
  },
  {
    name: "documentType",
    label: "Document Type",
    type: "select",
    placeholder: "Select Document Type",
    options: documentTypes,
    bindLabel: "DocumentTypeName",
    required: true,
    class: "col-md-6"
  },
  {
    name: "documentNumber1",
    label: "Document Number",
    type: "text",
    placeholder: "Enter Document Number",
    required: true,
    class: "col-md-6"
  },
  {
    name: "from_Date1",
    label: "Issue Date",
    type: "date",
    required: false,
    class: "col-md-6"
  },
  {
    name: "To_Date1",
    label: "Expiry Date",
    type: "date",
    required: false,
    class: "col-md-6"
  },
  {
    name: "uploadDocument",
    label: "Upload Document",
    type: "file-upload",
    required: false,
    class: "col-md-6",
    uploadText: "Choose File"
  },
  {
    name: "remark",
    label: "Remark",
    type: "text",
    placeholder: "Remark",
    required: false,
    class: "col-md-6"
  }
];

export const filterfields = (
  documentTypes: Option[] = [],
  suppliers: Option[] = [],
  transporters: Option[] = [],
  vehicles: Option[] = []
): FieldConfig[] => [
  {
    name: "fromDate",
    label: "From Date",
    type: "date",
    placeholder: "Select Date",
    required: false,
    class: "col-md-2"
  },
  {
    name: "toDate",
    label: "To Date",
    type: "date",
    placeholder: "Select Date",
    required: false,
    class: "col-md-2"
  },
  {
    name: "documentType",
    label: "Document Type",
    type: "select",
    placeholder: "--Select--",
    options: documentTypes,
    bindLabel: "DocumentTypeName",
    required: false,
    class: "col-md-2"
  },
  {
    name: "supplier",
    label: "Supplier",
    type: "select",
    placeholder: "--Select--",
    options: suppliers,
    bindLabel: "displayName",
    required: false,
    class: "col-md-2"
  },
  {
    name: "transporter",
    label: "Transporter",
    type: "select",
    placeholder: "--Select--",
    options: transporters,
    bindLabel: "TransporterName",
    required: false,
    class: "col-md-2"
  },
  {
    name: "vehicle",
    label: "Vehicle",
    type: "select",
    placeholder: "--Select--",
    options: vehicles,
    bindLabel: "VehicleNum",
    required: false,
    class: "col-md-2"
  }
];
