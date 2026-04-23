import { ColDef } from 'ag-grid-community';
import { getVehicleClass } from '../state-service/vehicle.utils';

export function getVehicleColumnDefs(context: any): ColDef[] {
  return [
    {
      headerName: 'Vehicle No',
      field: 'VehicleNo',
      minWidth: 120,
      maxWidth: 180,
      cellClass: params => getVehicleClass(params.data?.VehicleStatus || ''),
    },

    {
      headerName: 'Location',
      field: 'locationDisplay',
      width: 140,
      valueGetter: () => true,

      cellRenderer: (params: any) => {
        const row = params.data;
        if (!row) return '';

        const dots: string[] = [];

        const getStatus = (status: string) => {
          if (!status) return 'nodata';
          const s = status.toLowerCase();
          if (s === 'active') return 'active';
          if (s === 'inactive') return 'inactive';
          if (s === 'nodata') return 'nodata';
          if (s === 'breakdown') return 'Breakdown';
          if (s === 'nogps') return 'NoGPS';
          return 'nodata';
        };

        // MAIN
        if (row.LatLong) {
          const [lat, lng] = row.LatLong.split(',').map(Number);
          dots.push(`
            <span class="loc-dot main ${getStatus(row.VehicleStatus)}"
              title="${row.Location || ''} (${lat}, ${lng})">
            </span>
          `);
        }

        // OTHER DEVICES
        if (Array.isArray(row.otherDevices)) {
          row.otherDevices.forEach((d: any) => {
            if (d?.LatLong) {
              const [lat, lng] = d.LatLong.split(',').map(Number);
              dots.push(`
                <span class="loc-dot other ${getStatus(d.VehicleStatus)}"
                  title="${d.Location || ''} (${lat}, ${lng})">
                </span>
              `);
            }
          });
        }

        return dots.join('');
      }
    },

    {
      headerName: 'Engine',
      field: 'EngineStatus',
      width: 80,
      maxWidth: 90,
      cellRenderer: (params: any) => {
        const color =
          params.value === 'On' ? 'green' :
          params.value === 'Off' ? 'red' : 'grey';

        return `<i class="fa fa-key" style="color:${color}"></i>`;
      }
    },

    {
      headerName: 'Temp',
      field: 'Temperature',
      width: 100,
      cellRenderer: (params: any) => {
        if (!params.value) return '';
        return `<span>${params.value}°C</span>`;
      }
    },

    {
      headerName: 'Battery',
      field: 'Battery',
      width: 90,
      maxWidth: 100,
      cellClass: params => getVehicleClass(params.data?.VehicleStatus || ''),
      cellRenderer: (params: any) => {
        const b = params.data?.Battery;

        let icon = 'fa-battery-empty';
        if (b >= 75) icon = 'fa-battery-full';
        else if (b >= 50) icon = 'fa-battery-three-quarters';
        else if (b >= 25) icon = 'fa-battery-half';
        else if (b > 0) icon = 'fa-battery-quarter';

        return `<i class="fa ${icon}"></i>`;
      }
    },

    {
      headerName: 'Status',
      field: 'VehicleStatus',
      minWidth: 100,
      maxWidth: 120,
      cellClass: params => getVehicleClass(params.value || ''),
    },

    {
      headerName: '',
      field: 'GPSVendor',
      width: 60,
      cellRenderer: (params: any) => {
        const d = params.data;
        const valid = d?.GPSVendor !== 'Secutrak' && d?.DeviceType === '23';

        return valid
          ? `<i class="fa fa-video-camera video-icon"></i>`
          : '';
      },
      onCellClicked: (params: any) => {
        const d = params.data;
        if (d?.GPSVendor !== 'Secutrak' && d?.DeviceType === '23') {
          context.redirectLiveDashcam(d);
        }
      }
    }
  ];
}