import { inject } from '@angular/core';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

import { colors } from '../../../../shared/utils/constants';

export const tripSummaryGridColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Vehicle No',
    field: 'vehicle_no',
  },
  {
    headerName: 'Elock Status',
    field: 'elock_status',
  },
  {
    headerName: 'Transporter',
    field: 'transporter_name',
  },
  {
    headerName: 'MPC',
    field: 'mpc_name',
  },
  {
    headerName: 'Total Trips',
    field: 'total_trips',
    cellRenderer: (params: any) => {
      const count = params.value || 0;
      const span = document.createElement('span');
      span.innerText = count;
      if (count > 0) {
        span.style.color = colors.primary;
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'underline';
        span.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.onTripClick(
              params.data,
              'total_trips',
            );
          }
        });
      }
      return span;
    },
  },
  {
    headerName: 'Inactive Trips',
    field: 'inactive_trips',
    cellRenderer: (params: any) => {
      const count = params.value || 0;
      const span = document.createElement('span');
      span.innerText = count;
      if (count > 0) {
        span.style.color = colors.primary;
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'underline';
        span.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.onTripClick(
              params.data,
              'inactive_trips',
            );
          }
        });
      }
      return span;
    },
  },
  {
    headerName: 'Non Lock Trips',
    field: 'non_lock_trips',
    cellRenderer: (params: any) => {
      const count = params.value || 0;
      const span = document.createElement('span');
      span.innerText = count;
      if (count > 0) {
        span.style.color = colors.primary;
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'underline';
        span.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.onTripClick(
              params.data,
              'non_lock_trips',
            );
          }
        });
      }
      return span;
    },
  },
  {
    headerName: 'Lid Alert Trips',
    field: 'lid_alert_trips',
    cellRenderer: (params: any) => {
      const count = params.value || 0;
      const span = document.createElement('span');
      span.innerText = count;
      if (count > 0) {
        span.style.color = colors.primary;
        span.style.cursor = 'pointer';
        span.style.textDecoration = 'underline';
        span.addEventListener('click', () => {
          if (params.context?.componentParent) {
            params.context.componentParent.onTripClick(
              params.data,
              'lid_alert_trips',
            );
          }
        });
      }
      return span;
    },
  },
];

export const tripDetailColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr No.',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
  },
  { headerName: 'Vehicle No', field: 'vehicle_no' },
  { headerName: 'Dispatch No', field: 'dispatch_no' },
  { headerName: 'Dispatch Date', field: 'dispatch_date' },
  { headerName: 'LR No', field: 'lr_no' },
  {
    headerName: 'Plant Name & Code',
    valueGetter: (params: any) =>
      `${params.data?.plant_name || ''} (${params.data?.plant_code || ''})`,
  },
  {
    headerName: 'Supplier Name & Code',
    valueGetter: (params: any) =>
      `${params.data?.supplier_name || ''} (${params.data?.supplier_code || ''})`,
  },
  {
    headerName: 'Milk Type & Code',
    valueGetter: (params: any) =>
      `${params.data?.milk_type_name || ''} (${params.data?.milk_type || ''})`,
  },
];

export const getTripSummaryFilterFields = (
  tankerList: Option[] = [],
  mpcList: Option[] = [],
  plantList: Option[] = [],
  mccList: Option[] = [],
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
    type: 'select',
    placeholder: '--Select--',
    options: tankerList,
    bindLabel: 'VehicleNo',
  },
  {
    name: 'mpc',
    label: 'MPC Name',
    type: 'select',
    placeholder: '--Select--',
    options: mpcList,
    bindLabel: 'displayName',
  },
  {
    name: 'plant',
    label: 'Plant',
    type: 'select',
    placeholder: '--Select--',
    options: plantList,
    bindLabel: 'displayName',
  },
  {
    name: 'mcc',
    label: 'MCC Name',
    type: 'select',
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
