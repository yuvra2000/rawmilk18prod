import {
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
const retpot_type: any[] = [
  { name: 'Standard', value: 'Standard' },
  { name: 'Detailed', value: 'Detailed' },
];
const retpot_type_m: any[] = [
  { name: 'Standard', value: 'Standard' },
  { name: 'Detailed', value: 'Detailed' },
  { name: 'Day-wise', value: 'Day-wise' },
];
export const travelfeilds: FieldConfig[] = [
  {
    name: 'Vehicle',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Plant',
    multiple: true,
    showSelectAll: true,
    options: [], // 🔥 dynamic
    bindLabel: 'VehicleNo',
    required: true,
  },
  {
    name: 'from',
    type: 'datetime',
    label: 'From Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'to',
    type: 'datetime',
    label: 'To Date',
    placeholder: 'Select Date',
    required: true,
  },

  {
    name: 'Report',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select',
    options: retpot_type, // 🔥 dynamic
    bindLabel: 'name',
    required: true,
  },
  // {
  //   name: 'transporter',
  //   type: 'select',
  //   label: 'Transporter',
  //   placeholder: 'Select Transporter',
  //   options: [], // 🔥 dynamic
  //   bindLabel: 'TransporterName',
  // },
];
export const Distacefeilds: FieldConfig[] = [
  {
    name: 'Vehicle',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Vehicle',
    multiple: true,
    options: [], // 🔥 dynamic
    bindLabel: 'VehicleNo',
    required: true,
  },
  {
    name: 'from',
    type: 'datetime',
    label: 'From Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'to',
    type: 'datetime',
    label: 'To Date',
    placeholder: 'Select Date',
    required: true,
  },

  // {
  //   name: 'Report',
  //   type: 'select',
  //   label: 'Report Type',
  //   placeholder: 'Select',
  //   options: retpot_type, // 🔥 dynamic
  //   bindLabel: 'name',
  //   required: true,
  // },
  // {
  //   name: 'transporter',
  //   type: 'select',
  //   label: 'Transporter',
  //   placeholder: 'Select Transporter',
  //   options: [], // 🔥 dynamic
  //   bindLabel: 'TransporterName',
  // },
];

export const monthfeilds: FieldConfig[] = [
  {
    name: 'Vehicle',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Vehicle',
    multiple: true,
    showSelectAll: true,
    options: [], // 🔥 dynamic
    bindLabel: 'VehicleNo',
    required: true,
  },
  {
    name: 'Date',
    type: 'month',
    label: 'Date',
    placeholder: 'Select Date',
    required: true,
  },
  // {
  //   name: 'to',
  //   type: 'datetime',
  //   label: 'To Date',
  //   placeholder: 'Select Date',
  //   required: true,
  // },

  {
    name: 'Report',
    type: 'select',
    label: 'Report Type',
    placeholder: 'Select',
    options: retpot_type_m, // 🔥 dynamic
    bindLabel: 'name',
    required: true,
  },
  // {
  //   name: 'transporter',
  //   type: 'select',
  //   label: 'Transporter',
  //   placeholder: 'Select Transporter',
  //   options: [], // 🔥 dynamic
  //   bindLabel: 'TransporterName',
  // },
];

export const travelStandardGrid: GridColumnConfig[] = [
  // {
  //   headerName: '',
  //   width: 60,
  //   cellRenderer: (params: any) => {
  //     const span = document.createElement('span');
  //     span.innerHTML = `<i class="fa fa-plus"></i>`;
  //     span.style.cursor = 'pointer';

  //     span.addEventListener('click', () => {
  //       params.context?.componentParent?.find_detailreport(
  //         params.data.vehicle_no,
  //       );
  //     });

  //     return span;
  //   },
  // },
  {
    headerName: 'S.No',
    width: 100,
    cellRenderer: (params: any) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '8px';

      // ➕ icon
      const icon = document.createElement('span');
      icon.innerHTML = `<i class="fa fa-plus"></i>`;
      icon.style.cursor = 'pointer';

      icon.addEventListener('click', () => {
        params.context?.componentParent?.find_detailreport(
          params.data.vehicle_no,
        );
      });

      // 🔢 Serial Number
      const serial = document.createElement('span');
      serial.innerText = (params.node.rowIndex + 1).toString();

      // append both
      container.appendChild(icon);
      container.appendChild(serial);

      return container;
    },
  },

  {
    headerName: 'Vehicle',
    field: 'vehicle_no',
  },

  {
    headerName: 'Device/IMEI',
    field: 'imei_no',
  },

  {
    headerName: 'Start DateTime',
    field: 'travel_start_time',
  },

  {
    headerName: 'Start Location',
    field: 'startLocation',
    autoHeight: true,
    cellRenderer: (params: any) => {
      const span = document.createElement('span');

      const updateText = () => {
        span.innerText = params.data.startLocation || params.data.startCoords;
      };

      updateText();

      span.style.cursor = params.data.startLocation ? 'default' : 'pointer';

      // ✅ Only call API if address not available
      if (!params.data.startLocation) {
        span.addEventListener(
          'mouseenter',
          () => {
            // 🔥 prevent multiple calls
            if (!params.data.startLocation && !params.data._loading) {
              params.data._loading = true;

              span.innerText = 'Loading...';

              params.context?.componentParent
                ?.findAddress11(params.data.startCoords, params.data)
                ?.finally?.(() => {
                  params.data._loading = false;
                  updateText(); // refresh text after API
                });
            }
          },
          { once: true }, // ✅ run only once
        );
      }

      return span;
    },
  },

  {
    headerName: 'End DateTime',
    field: 'travel_end_time',
  },

  {
    headerName: 'End Location',
    field: 'endLocation',
    autoHeight: true,
    cellRenderer: (params: any) => {
      const span = document.createElement('span');
      span.innerText = params.data.endLocation || params.data.endCoords;

      span.style.cursor = params.data.endLocation ? 'default' : 'pointer';

      if (!params.data.endLocation) {
        span.addEventListener('mouseover', () => {
          params.context?.componentParent?.findAddress11(
            params.data.endCoords,
            params.data,
          );
        });
      }

      return span;
    },
  },

  {
    headerName: 'Distance (km)',
    field: 'totalDist',
  },

  {
    headerName: 'Travel Time',
    field: 'travelDuration',
  },

  {
    headerName: 'Max Speed',
    field: 'maxSpeed',
  },

  {
    headerName: 'Average Speed',
    field: 'avgSpeed',
  },
];

export const travelDetailedGrid: GridColumnConfig[] = [
  {
    headerName: 'S.No',
    valueGetter: 'node.rowIndex + 1',
    width: 80,
  },

  {
    headerName: 'Vehicle',
    field: 'vehicle_no',
  },

  {
    headerName: 'Device/IMEI',
    field: 'imei_no',
  },

  {
    headerName: 'Start DateTime',
    field: 'travel_start_time',
  },

  {
    headerName: 'Start Location',
    field: 'startLocation',
    cellRenderer: (params: any) =>
      params.data.startLocation || params.data.startCoords,
  },

  {
    headerName: 'End DateTime',
    field: 'travel_end_time',
  },

  {
    headerName: 'End Location',
    field: 'endLocation',
    cellRenderer: (params: any) =>
      params.data.endLocation || params.data.endCoords,
  },

  {
    headerName: 'Distance (km)',
    field: 'distance',
  },

  {
    headerName: 'Travel Time',
    field: 'travelTime',
  },

  {
    headerName: 'Max Speed',
    field: 'maxSpeed',
  },

  {
    headerName: 'Average Speed',
    field: 'averageSpeed',
  },
];

export const DistanceGrid: GridColumnConfig[] = [
  {
    headerName: 'S.No',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
  },

  {
    headerName: 'Start Time',
    field: 'travel_start_time',
  },

  {
    headerName: 'End Time',
    field: 'travel_end_time',
  },

  // 🔥 Start Place
  {
    headerName: 'Start Place',
    field: 'startLocation',
    autoHeight: true,
    cellRenderer: (params: any) => {
      const span = document.createElement('span');

      span.innerText = params.data.startLocation || params.data.startCoords;

      span.style.cursor = params.data.startLocation ? 'default' : 'pointer';

      // ✅ Tooltip
      span.title = params.data.startLocation || 'Hover to load address';

      // ✅ Call API only if not available
      if (!params.data.startLocation) {
        span.addEventListener('mouseenter', () => {
          params.context?.componentParent?.findAddress11(
            params.data.startCoords,
            params.data,
          );
        });
      }

      return span;
    },
  },

  // 🔥 End Place
  {
    headerName: 'End Place',
    field: 'endLocation',
    autoHeight: true,
    cellRenderer: (params: any) => {
      const span = document.createElement('span');

      span.innerText = params.data.endLocation || params.data.endCoords;

      span.style.cursor = params.data.endLocation ? 'default' : 'pointer';

      // ✅ Tooltip
      span.title = params.data.endLocation || 'Hover to load address';

      // ✅ Call API only if not available
      if (!params.data.endLocation) {
        span.addEventListener('mouseenter', () => {
          params.context?.componentParent?.findAddress11(
            params.data.endCoords,
            params.data,
          );
        });
      }

      return span;
    },
  },

  {
    headerName: 'Distance Travelled (km)',
    field: 'distance',
  },

  {
    headerName: 'Travel Time',
    field: 'travelTime',
  },

  {
    headerName: 'Max Speed (km/hr)',
    field: 'maxSpeed',
  },

  {
    headerName: 'Average Speed (km/hr)',
    field: 'averageSpeed',
  },
];



export const monthStandardGrid: GridColumnConfig[] = [
  {
    headerName: '',
    width: 100,
    cellRenderer: (params: any) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '8px';

      // ➕ icon
      const icon = document.createElement('span');
      icon.innerHTML = `<i class="fa fa-plus"></i>`;
      icon.style.cursor = 'pointer';

      icon.addEventListener('click', () => {
        params.context?.componentParent?.find_detailreport(
          params.data.vehicle_no,
        );
      });

      // 🔢 Serial Number
      const serial = document.createElement('span');
      serial.innerText = (params.node.rowIndex + 1).toString();

      // append both
      container.appendChild(icon);
      container.appendChild(serial);

      return container;
    },
  },
  {
    headerName: 'Start Time',
    field: 'travel_start_time',
  },
  {
    headerName: 'End Time',
    field: 'travel_end_time',
  },
  {
    headerName: 'Vehicle',
    field: 'vehicle_no',
  },
  {
    headerName: 'IMEI',
    field: 'imei_no',
  },
  {
    headerName: 'Distance (km)',
    field: 'totalDist',
  },
  {
    headerName: 'Travel Time',
    field: 'travelDuration',
  },
  {
    headerName: 'Max Speed',
    field: 'maxSpeed',
  },
  {
    headerName: 'Avg Speed',
    field: 'avgSpeed',
  },
];

export const dayWiseGrid: GridColumnConfig[] = [
  {
    headerName: 'S.No',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
  },
  {
    headerName: 'Vehicle No',
    field: 'vehicle_no',
  },
  {
    headerName: 'IMEI No',
    field: 'imei_no',
  },
  {
    headerName: 'Date',
    field: 'date',
  },
  {
    headerName: 'Distance (km)',
    field: 'distance',
  },
  {
    headerName: 'Max Speed',
    field: 'maxspeed',
  },
  {
    headerName: 'Avg Speed',
    field: 'avgSpeed',
  },
];

export const detailedGrid: GridColumnConfig[] = [
  {
    headerName: 'S.No',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
  },
  {
    headerName: 'Vehicle',
    field: 'vehicle_no',
  },
  {
    headerName: 'IMEI',
    field: 'imei_no',
  },
  {
    headerName: 'Start Time',
    field: 'travel_start_time',
  },
  {
    headerName: 'End Time',
    field: 'travel_end_time',
  },
  {
    headerName: 'Distance (km)',
    field: 'distance',
  },
  {
    headerName: 'Travel Time',
    field: 'travelTime',
  },
  {
    headerName: 'Max Speed',
    field: 'maxSpeed',
  },
  {
    headerName: 'Avg Speed',
    field: 'averageSpeed',
  },
];
