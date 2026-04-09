import { inject } from '@angular/core';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';

export const getTripSummaryFilterFields = (
  tankerList: any[] = [],
  mpcList: any[] = [],
  plantList: any[] = [],
  mccList: any[] = [],
): FieldConfig[] => [
  {
    name: 'fromDate',
    label: 'From Date',
    type: 'date',
    placeholder: 'Select Date',

    required: true,
  },
  {
    name: 'toDate',
    label: 'To Date',
    type: 'date',
    placeholder: 'Select Date',

    required: true,
  },
  {
    name: 'tanker',
    label: 'Tanker',
    type: 'search-select',
    placeholder: '--Select--',
    options: tankerList,
    bindLabel: 'VehicleNo',
  },
  {
    name: 'mpc',
    label: 'MPC Name',
    type: 'search-select',
    placeholder: '--Select--',
    options: mpcList,
    bindLabel: 'displayName',
  },
  {
    name: 'plant',
    label: 'Plant',
    type: 'search-select',
    placeholder: '--Select--',
    options: plantList,
    bindLabel: 'displayName',
  },
  {
    name: 'mcc',
    label: 'MCC Name',
    type: 'search-select',
    placeholder: '--Select--',
    options: mccList,
    bindLabel: 'MccName', // Adjust this if the API returns a different label property
  },
  {
    name: 'indentNo',
    label: 'Indent No',
    type: 'text',
    placeholder: 'Enter Indent No',
  },
  {
    name: 'dispatchNumber',
    label: 'Dispatch Number',
    type: 'text',
    placeholder: 'Enter Dispatch Number',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: '--Select--',
    options: [
      { id: '', name: 'All' },
      { id: 'No GPS', name: 'No GPS' },
      { id: 'Active', name: 'Active' },
      { id: 'Inactive', name: 'Inactive' },
    ],
  },
  {
    name: 'trigger',
    label: 'Trigger',
    type: 'select',
    placeholder: '--Select--',
    options: [{ id: '', name: 'All' }],
  },
  {
    name: 'transporter',
    label: 'Transporter',
    type: 'select',
    placeholder: '--Select--',
    options: [
      { id: '', name: 'All' },
      { id: 'ACCEPT', name: 'Accept' },
      { id: 'REJECT', name: 'Reject' },
    ],
  },
];
