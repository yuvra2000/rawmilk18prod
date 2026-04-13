import { GridColumnConfig } from '../../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  FieldConfig,
  Option,
} from '../../../../../shared/components/filter-form/filter-form.component';
const intervalList: Option[] = [
  { id: '0', name: '5' },
  { id: '10', name: '10' },
  { id: '15', name: '15' },
  { id: '20', name: '20' },
  { id: '25', name: '25' },
  { id: '30', name: '30' },
  { id: '35', name: '35' },
  { id: '40', name: '40' },
  { id: '45', name: '45' },
  { id: '50', name: '50' },
  { id: '55', name: '55' },
  { id: '60', name: '60' },
  { id: '65', name: '65' },
  { id: '70', name: '70' },
  { id: '75', name: '75' },
  { id: '80', name: '80' },
  { id: '85', name: '85' },
  { id: '90', name: '90' },
  { id: '95', name: '95' },
  { id: '100', name: '100' },
  { id: '105', name: '105' },
  { id: '110', name: '110' },
  { id: '115', name: '115' },
  { id: '120', name: '120' },
  { id: '125', name: '125' },
  { id: '130', name: '130' },
  { id: '135', name: '135' },
  { id: '140', name: '140' },
  { id: '145', name: '145' },
  { id: '150', name: '150' },
  { id: '155', name: '155' },
  { id: '160', name: '160' },
  { id: '165', name: '165' },
  { id: '170', name: '170' },
  { id: '175', name: '175' },
  { id: '180', name: '180' },
  { id: '185', name: '185' },
  { id: '190', name: '190' },
  { id: '195', name: '195' },
  { id: '200', name: '200' },
  { id: '205', name: '205' },
  { id: '210', name: '210' },
  { id: '215', name: '215' },
  { id: '220', name: '220' },
  { id: '225', name: '225' },
  { id: '230', name: '230' },
  { id: '235', name: '235' },
  { id: '240', name: '240' },
  { id: '245', name: '245' },
  { id: '250', name: '250' },
  { id: '255', name: '255' },
  { id: '260', name: '260' },
  { id: '265', name: '265' },
  { id: '270', name: '270' },
  { id: '275', name: '275' },
  { id: '280', name: '280' },
  { id: '285', name: '285' },
  { id: '290', name: '290' },
  { id: '295', name: '295' },
  { id: '300', name: '300' },
];

export const filterfields = (
  vehicleList: Option[] = [],
  geoFenceList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'vehicle_imei',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Vehicle',
    multiple: true,
    options: vehicleList,
    emitValueChanges: true,
  },

  {
    name: 'from',
    type: 'datetime',
    label: 'From Date',
    placeholder: 'Select Date',
    step: 300,
  },
  {
    name: 'to',
    type: 'datetime',
    label: 'To Date',
    placeholder: 'Select Date',
    step: 300,
  },
  {
    name: 'threshold',
    type: 'select',
    label: 'Interval Minutes',
    placeholder: 'Select Interval',
    options: intervalList,
  },
  {
    name: 'geofence_id',
    type: 'select',
    label: 'Exclusive Area',
    placeholder: 'Select Geo Fence',
    multiple: true,
    options: geoFenceList,
  },
];
export const gridColumns: GridColumnConfig[] = [
  {
    headerName: 'SNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 90,
  },
  {
    headerName: 'Vehicle',
    field: 'vehicle',
    minWidth: 140,
  },
  {
    headerName: 'Device/IMEI',
    field: 'imei',
    minWidth: 160,
  },
  {
    headerName: 'Location',
    valueGetter: (params: any) => {
      const location = params.data?.location || '';
      return location?.split?.('*')?.[0] || location;
    },
    minWidth: 220,
  },
  {
    headerName: 'Start DateTime',
    field: 'arrival',
    minWidth: 180,
  },
  {
    headerName: 'End DateTime',
    field: 'departure',
    minWidth: 180,
  },
  {
    headerName: 'Halt Duration',
    field: 'haltDurtin',
    minWidth: 140,
  },
  {
    headerName: 'Latitude/Longitude',
    valueGetter: (params: any) => {
      const lat = params.data?.lat ?? '';
      const lng = params.data?.lng ?? '';
      return lat !== '' || lng !== '' ? `${lat}, ${lng}` : '';
    },
    minWidth: 190,
  },
];
