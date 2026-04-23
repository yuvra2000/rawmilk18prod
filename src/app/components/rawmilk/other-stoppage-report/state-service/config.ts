import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

export const otherStoppageFilterFields: FieldConfig[] = [
  {
    name: 'from',
    label: 'From Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
  {
    name: 'to',
    label: 'To Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
];
// export const cartColumns: GridColumnConfig[] = [];
export const cartColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 70,
  },
  {
    headerName: 'Cart no',
    field: 'cart_no',
    width: 150,
  },
  {
    headerName: 'Adda Name',
    field: 'adda_name',
    valueGetter: (params: any) => {
      const addaName = params.data?.adda_name || '';
      const addaCode = params.data?.adda_code || '';
      return addaName && addaCode
        ? `${addaName} -${addaCode}`
        : addaName || addaCode || '-';
    },
  },
  {
    headerName: 'Franchise Name',
    field: 'franchise_name',
    width: 150,
    valueGetter: (params: any) => {
      const franchiseName = params.data?.franchise_name || '';
      const franchiseCode = params.data?.franchise_code || '';
      return franchiseName && franchiseCode
        ? `${franchiseName} -${franchiseCode}`
        : franchiseName || franchiseCode || '-';
    },
  },

  {
    headerName: 'Start Time',
    field: 'cart_start_time',
  },
  {
    headerName: 'End Time',
    field: 'cart_end_time',
  },
  {
    headerName: 'Duration',
    field: 'duration',
    minWidth: 100,
    width: 100,
    headerTooltip: 'Duration in minutes',
  },
  {
    headerName: 'Scheduled Time ',
    field: 'scheduled_time',
  },
  {
    headerName: 'Region',
    field: 'region_code',
    width: 120,
  },
  {
    headerName: 'Adda GeoCoords',
    field: 'adda_latlng',
  },
  {
    headerName: 'Base Location Dist',
    field: 'nearest_base_dist',
    width: 100,
    headerTooltip: 'Distance from nearest base location in km',
  },
];
