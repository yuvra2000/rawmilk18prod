import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';

export const tripDashboardVLCFilterFields = (): FieldConfig[] => [
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    placeholder: 'Select Date',
  },
  {
    name: 'refrigeratedType',
    label: 'Refrigerated Type',
    type: 'select',
    placeholder: 'Select Refrigerated Type',
    options: [
      { name: 'Refrigerated', id: 'No' },
      { name: 'Not Refrigerated', id: 'YES' },
    ],
  },
  {
    name: 'segment',
    label: 'Segment',
    type: 'select',
    placeholder: 'Select segment',
    options: [],
  },
];

export const tripDashboardVLCGridColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
  },
  { headerName: 'Route Status', field: 'route_status' },
  { headerName: 'Vehicle', field: 'vehicle' },
  { headerName: 'Transporter', field: 'transporter' },
  { headerName: 'Shift', field: 'shift' },
  { headerName: 'Source', field: 'source' },
  { headerName: 'Destination', field: 'destination' },
  { headerName: 'Dispatch Time', field: 'dispatch_time' },
  { headerName: 'Arrival Time', field: 'arrival_time' },
  { headerName: 'Dispatch Temp', field: 'dispatch_temp' },
  { headerName: 'Arrival Temp', field: 'arrival_temp' },
  { headerName: 'Alerts', field: 'alerts' },
  { headerName: 'Points Completed', field: 'points_completed' },
  { headerName: 'Points Pending', field: 'points_pending' },
  { headerName: 'ETA', field: 'eta' },
  { headerName: 'Vehicle Status', field: 'vehicle_status' },
  { headerName: 'Remarks', field: 'remarks' },
  { headerName: 'Action', field: 'action' },
];
