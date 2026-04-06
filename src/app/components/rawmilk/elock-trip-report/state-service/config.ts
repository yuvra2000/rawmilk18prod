import { FieldConfig, Option } from "../../../../shared/components/filter-form/filter-form.component";

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
      { id: 'All', name: 'All' },
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
      { id: 'All', name: 'All' },
      { id: 'Success', name: 'Success' },
      { id: 'Fail', name: 'Fail' },
    ],
    bindLabel: 'name',
    placeholder: 'Select Status',
  }
];
