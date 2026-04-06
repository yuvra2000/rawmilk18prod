import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";
import { GridColumnConfig, ActionCellRendererComponent } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const gridColumns: GridColumnConfig[] = [
  {
    headerName: 'SL',
    valueGetter: (params: any) => params.node ? params.node.rowIndex + 1 : null,
    width: 60,
  },
  {
    headerName: 'Vehicle',
    field: 'Vehicle'
  },
  {
    headerName: 'OTP for',
    field: 'OTPfor'
  },
  {
    headerName: 'OTP Type',
    field: 'otpType'
  },
  {
    headerName: 'User',
    field: 'user'
  },
  {
    headerName: 'MobileIMENo',
    field: 'MobileIMENo'
  },
  {
    headerName: 'Action Time',
    field: 'actionTym'
  },
  {
    headerName: 'Location Action',
    field: 'location'
  },
  {
    headerName: 'Image URL',
    field: 'image',
    hide: true
  },
  {
    headerName: 'View Images',
    field: 'action',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          label: 'View',
          tooltip: 'View Images',
          onClick: (data: any, node: any, params: any) => {
            console.log('View button clicked for row data:', data);
            if (params.context?.componentParent) {
              params.context.componentParent.onView(data);
            }
          },
          buttonStyle: 'cursor: pointer; text-decoration: underline; color: ' + colors.primary,
        }
      ]
    }
  }
];

export const elockFilterFields = (vehicleList: Option[] = []): FieldConfig[] => [
  {
    name: 'fromDate',
    label: 'From Datetime',
    type: 'datetime'
  },
  {
    name: 'toDate',
    label: 'To Datetime',
    type: 'datetime'
  },
  {
    name: 'vehicleNumber',
    label: 'Vehicle Number',
    type: 'select',
    options: vehicleList,
    bindLabel: 'VehicleNo',
    placeholder: 'Select Vehicle',
  },
  {
    name: 'otpFor',
    label: 'OTP For',
    type: 'select',
    options: [
      { id: '', name: 'All' },
      { id: 'Lock', name: 'Lock' },
      { id: 'Unlock', name: 'Unlock' },
    ],
    bindLabel: 'name',
    placeholder: 'Select OTP For',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { id: '', name: 'All' },
      { id: 'Success', name: 'Success' },
      { id: 'Fail', name: 'Fail' },
    ],
    bindLabel: 'name',
    placeholder: 'Select Status',
  }
];
