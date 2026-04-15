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
const vehicleList: Option[] = [
  { id: 'single', name: 'Single Chamber' },
  { id: 'multiple', name: 'Multiple Chamber' },
  { id: 'both', name: 'Both' },
];
// Filter field configuration based on requirements
export const filterfields = (mccList: Option[] = []): FieldConfig[] => [
  {
    name: 'MccId',
    type: 'select',
    label: 'MCC',
    placeholder: 'Select MCC',
    options: mccList,
    bindLabel: 'displayName',
    class: 'col-md-2',
  },
  {
    name: 'VehicleType',
    type: 'select',
    label: 'Vehicle Type',
    placeholder: 'Select Vehicle Type',
    options: vehicleList,
    class: 'col-md-2',
  },
  {
    name: 'MaxVehCapacity',
    type: 'text',
    label: 'Max Vehicle Capacity',
    placeholder: 'Enter Maximum Vehicle Capacity',
    class: 'col-md-2',
  },
  {
    name: 'MinVehCapacity',
    type: 'text',
    label: 'Min Vehicle Capacity',
    placeholder: 'Enter Minimum Vehicle Capacity',
    class: 'col-md-2',
  },
  {
    name: 'StandByVehCount',
    type: 'text',
    label: 'Standby Vehicle Count',
    placeholder: 'Standby Vehicle Count',
    class: 'col-md-2',
  },
];
// Grid column configuration based on actual data structure
export const mccMappingColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr No',
    field: 'srNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Mcc',
    field: 'Mcc',
  },
  {
    headerName: 'Vehicle Type',
    field: 'VehChamberType',
  },
  {
    headerName: 'Min Capacity',
    field: 'MinVehCapacity',

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Max Capacity',
    field: 'MaxVehCapacity',

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Standby Vehicle Required',
    field: 'StandByVehCount',

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Action',
    field: 'action',
    pinned: 'right',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa fa-trash',
          tooltip: 'Delete',
          onClick: (data: any, node: any, params: any) => {
            const parent = params?.context?.componentParent;
            if (parent && typeof parent.deleteMapping === 'function') {
              parent.deleteMapping(data);
            }
          },
          iconStyle: {
            color: 'red',
            cursor: 'pointer',
            fontSize: '18px',
          },
        },
      ],
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
];
export const dummyMccMappingData = [
  {
    Mcc: 'MCC-001',
    VehChamberType: 'Single Chamber',
    MinVehCapacity: 1000,
    MaxVehCapacity: 1500,
    StandByVehCount: 2,
  },
  {
    Mcc: 'MCC-002',
    VehChamberType: 'Multiple Chamber',
    MinVehCapacity: 1200,
    MaxVehCapacity: 1800,
    StandByVehCount: 3,
  },
  {
    Mcc: 'MCC-003',
    VehChamberType: 'Both',
    MinVehCapacity: 900,
    MaxVehCapacity: 1400,
    StandByVehCount: 1,
  },
];
