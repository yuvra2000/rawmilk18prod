import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

const userType = localStorage.getItem('usertype') || '';

// Filter field configuration based on requirements
export const filterfields = (
  milkTypeList: Option[] = [],
  supplierList: Option[] = [],
  plantList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'date',
    type: 'date',
    label: 'Date',
    placeholder: 'Select Date',
    required: true,
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
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
    class: 'col-md-2',
  },
  {
    name: 'plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: plantList,
    bindLabel: 'displayName',
    class:
      userType == 'Corporate Plant' 
        ? 'd-none'
        : 'col-md-2',
  },
];

// Grid column configuration based on actual data structure
export const dispatchPlanningColumns: GridColumnConfig[] = [
  {
    headerName: 'SR No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    pinned: 'left',
  },
  {
    headerName: 'Supplier Name',
    field: 'supplierName',
    valueGetter: (params: any) => {
      const supplierName = params.data?.supplierName || '';
      const supplierCode = params.data?.supplier_code || '';
      return supplierName && supplierCode
        ? `${supplierName}-${supplierCode}`
        : supplierName || supplierCode;
    },
    width: 180,
  },
  {
    headerName: 'Type of Milk',
    field: 'milkType',
    valueGetter: (params: any) => {
      const milkName = params.data?.milkName || '';
      const milktype = params.data?.milktype || '';
      return milkName && milktype
        ? `${milkName}-${milktype}`
        : milkName || milktype;
    },
    width: 150,
  },
  {
    headerName: 'Tanker No.',
    field: 'tankerNo',
    valueGetter: (params: any) =>
      params.data?.vehicleno || params.data?.TankerNo || '',
    width: 120,
  },
  {
    headerName: 'Arrival Date at Plant',
    field: 'arrivalDate',
    valueGetter: (params: any) => {
      const date = params.data?.arivaldate || params.data?.ArrivalDate || '';
      return date ? new Date(date).toLocaleDateString() : '';
    },
    width: 160,
  },
  {
    headerName: 'Tentative Arrival Time at Plant',
    field: 'arrivalTime',
    valueGetter: (params: any) =>
      params.data?.arivaltime || params.data?.ArrivalTime || '',
    width: 200,
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
    valueGetter: (params: any) => {
      const qty = params.data?.quantity || 0;
      return qty ? qty.toLocaleString() : '0';
    },
    width: 120,
    cellStyle: { textAlign: 'right' },
  },
  {
    headerName: 'Transit Status',
    field: 'transitStatus',
    valueGetter: (params: any) => {
      const status = params.data?.transit_status;
      return status == 1 ? 'To Be Dispatch' : 'In-Transit';
    },
    width: 130,
    cellRenderer: (params: any) => {
      const status = params.value || '';
      const statusClass =
        status === 'To Be Dispatch'
          ? 'badge-warning'
          : status === 'In-Transit'
            ? 'badge-info'
            : 'badge-secondary';
      return status
        ? `<span class="badge ${statusClass}">${status}</span>`
        : '';
    },
  },
  {
    headerName: 'Destination',
    field: 'destination',
    valueGetter: (params: any) => {
      const destinationName = params.data?.destinationName || '';
      const destination = params.data?.destination || '';
      return destinationName && destination
        ? `${destinationName}-${destination}`
        : destinationName || destination;
    },
    width: 180,
  },
  {
    headerName: 'OLD Plant',
    field: 'oldPlant',
    valueGetter: (params: any) =>
      params.data?.destinationOldName || params.data?.old_plant || '',
    width: 120,
  },
];

// Action column for dispatch planning
export const actionColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  width: 120,
  pinned: 'right',
  cellRendererParams: {
    actions: [
      {
        icon: 'fa fa-random',
        tooltip: 'Divert',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onDivert(data);
          }
        },
        iconStyle: {
          color: '#1d4380',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '8px',
        },
      },
      {
        icon: 'fa fa-trash',
        tooltip: 'Delete',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onDelete(data);
          }
        },
        iconStyle: {
          color: '#dc3545',
          cursor: 'pointer',
          fontSize: '16px',
        },
      },
    ],
  },
};
