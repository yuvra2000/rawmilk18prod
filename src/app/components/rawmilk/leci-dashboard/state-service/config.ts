import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { AlertsCellRendererComponent } from '../alerts-cell-renderer/alerts-cell-renderer.component';

const typeList: Option[] = [
  { id: 'All', name: 'All' },
  { id: 'CANCELLED', name: 'CANCELLED' },
];

export const leciDashboardFilterFields = (
  supplierOptions: Option[] = [],
  plantOptions: Option[] = [],
  transportOptions: Option[] = [],
  mccOptions: Option[] = [],
): FieldConfig[] => [
  {
    name: 'fromDate',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
  },
  {
    name: 'toDate',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
  },
  {
    name: 'supplier',
    type: 'select',
    label: 'Supplier',
    placeholder: '--Select Supplier--',
    options: supplierOptions,
    bindLabel: 'displayName',
  },
  {
    name: 'plant',
    type: 'select',
    label: 'Plant',
    placeholder: '--Select Plant--',
    options: plantOptions,
    bindLabel: 'displayName',
  },
  {
    name: 'transport',
    type: 'select',
    label: 'Transport',
    placeholder: '--Select Transport--',
    options: transportOptions,
    bindLabel: 'TransporterName',
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'MCC',
    placeholder: '--Select Transport--',
    options: mccOptions,
    bindLabel: 'displayName',
  },
  {
    name: 'type',
    type: 'select',
    label: 'Type',
    placeholder: '--Select Type--',
    options: typeList,
    bindLabel: 'name',
  },
];

// ─── LECI Dashboard Table Columns ──────────────────────────────────────────

function dispatchStatusBadge(status: string): string {
  const map: Record<string, { bg: string; color: string }> = {
    open: { bg: '#fff3cd', color: '#856404' },
    closed: { bg: '#d4edda', color: '#155724' },
    cancelled: { bg: '#f8d7da', color: '#721c24' },
    running: { bg: '#cce5ff', color: '#004085' },
    inactive: { bg: '#e2e3e5', color: '#383d41' },
    stopped: { bg: '#f8d7da', color: '#721c24' },
  };
  const key = (status || '').toLowerCase();
  const style = map[key] || { bg: '#e2e3e5', color: '#383d41' };
  return `<span style="background:${style.bg};color:${style.color};padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;text-transform:uppercase;white-space:nowrap">${status || '-'}</span>`;
}

function leciStatusBadge(status: number): string {
  if (status === 1) {
    return `<span style="background:#d4edda;color:#155724;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">Active</span>`;
  } else if (status === 0) {
    return `<span style="background:#f8d7da;color:#721c24;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600">Inactive</span>`;
  }
  return '<span style="color:#aaa">-</span>';
}

function lockStatusRenderer(rawLocks: any): string {
  let locks = rawLocks;
  // Handle case where lockStatus is a stringified JSON array (e.g., from DB)
  if (typeof locks === 'string') {
    try {
      locks = JSON.parse(locks);
    } catch (e) {}
  }

  if (!locks || !Array.isArray(locks) || locks.length === 0)
    return '<span style="color:#aaa">-</span>';
  return locks
    .map((lockObj) => {
      const [key, val] = Object.entries(lockObj)[0] || [];
      if (!key) return '';
      // Handle both 'Y' and '1' as locked states just in case
      const isLocked = val === 'Y' || val === '1';
      const icon = isLocked
        ? `<i class="fa-solid fa-lock" style="color:#dc3545;font-size:13px"></i>`
        : `<i class="fa-solid fa-lock-open" style="color:#28a745;font-size:13px"></i>`;
      return `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:8px;font-size:12px;font-weight:600">${key}&nbsp;${icon}</span>`;
    })
    .join('');
}

export const leciDashboardColumns: GridColumnConfig[] = [
  {
    field: 'id',
    hide: true,
  },
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => (params.node.rowIndex ?? 0) + 1,
    width: 70,
    sortable: false,
    filter: false,
  },
  {
    headerName: 'Milk Type',
    field: 'MilkType',
    minWidth: 160,
  },
  {
    headerName: 'Dispatch No',
    field: 'ChallanNo',
    minWidth: 140,
  },
  {
    headerName: 'Vehicle No',
    field: 'vehicle_no',
    minWidth: 120,
  },
  {
    headerName: 'Status',
    field: 'dispatchStatus',
    minWidth: 110,
    cellRenderer: (params: any) => dispatchStatusBadge(params.value),
  },
  {
    headerName: 'LECI Status',
    field: 'status',
    minWidth: 110,
    cellRenderer: (params: any) => leciStatusBadge(params.value),
  },
  {
    headerName: 'Live Lock Status',
    field: 'lockStatus',
    minWidth: 160,
    cellRenderer: (params: any) => lockStatusRenderer(params.value),
    valueFormatter: (params: any) => {
      let locks = params.value;
      if (typeof locks === 'string') {
        try {
          locks = JSON.parse(locks);
        } catch (e) {}
      }
      if (!locks || !Array.isArray(locks) || locks.length === 0) return '-';

      return locks
        .map((lockObj: Record<string, string>) => {
          const [key, val] = Object.entries(lockObj)[0] || [];
          if (!key) return '';
          const isLocked = val === 'Y' || val === '1';
          return `${key} (${isLocked ? 'Locked' : 'Unlocked'})`;
        })
        .join(', ');
    },
  },
  {
    headerName: 'Transporter',
    field: 'Transporter',
    minWidth: 150,
  },
  {
    headerName: 'Supplier',
    field: 'Supplier',
    minWidth: 200,
  },
  {
    headerName: 'MCC',
    field: 'Mcc',
    minWidth: 180,
  },
  {
    headerName: 'Plant',
    field: 'Plant',
    minWidth: 160,
  },
  {
    headerName: 'Dispatch Date',
    field: 'DispatchDate',
    minWidth: 150,
    valueGetter: (params: any) => {
      const d = params.data?.DispatchDate;
      return d ? d.split(' ')[0] + ' ' + (d.split(' ')[1] || '') : '-';
    },
  },
  {
    headerName: 'Target Date',
    field: 'targetDate',
    minWidth: 120,
  },
  {
    headerName: 'Lr. No',
    field: 'LRNumber',
    minWidth: 110,
  },
  {
    headerName: 'Indent No',
    field: 'IndentNo',
    minWidth: 140,
  },
  {
    headerName: 'Chamber No',
    field: 'chamber',
    minWidth: 110,
  },
  {
    headerName: 'Qty',
    field: 'Qty',
    minWidth: 90,
  },
  {
    headerName: 'Fat',
    field: 'Fat',
    minWidth: 80,
  },
  {
    headerName: 'Snf',
    field: 'Snf',
    minWidth: 80,
  },
  {
    headerName: 'Temperature',
    field: 'Temperature',
    minWidth: 110,
  },
  {
    headerName: 'MBRT',
    field: 'Mbrt',
    minWidth: 90,
  },
  {
    headerName: 'Mapped Plant',
    field: 'Plant',
    minWidth: 160,
    columnGroupShow: 'open',
  },
  {
    headerName: 'ETA',
    field: 'eta',
    minWidth: 90,
  },
  {
    headerName: 'Alerts',
    field: 'AlertData',
    minWidth: 350,
    cellRenderer: AlertsCellRendererComponent,
    valueFormatter: (params: any) => {
      const alerts = params.data?.Alerts;
      if (Object.keys(alerts).length === 0) {
        return '-';
      }
      return Object.keys(alerts)
        .map((key) => `${key}: ${alerts[key]}`)
        .join(' ');
    },
  },
  {
    headerName: 'MCC Geofence Out',
    field: 'MccGeofenceOut',
    minWidth: 160,
    valueGetter: (params: any) => params.data?.MccGeofenceOut || '-',
  },
  {
    headerName: 'Driver Details',
    field: 'DriverDetails',
    minWidth: 180,
  },
];

// ─── Alert Detail Modal Columns ─────────────────────────────────────────────
export const alertDetailColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr.No.',
    valueGetter: (params: any) => (params.node.rowIndex ?? 0) + 1,
    width: 70,
    sortable: false,
    filter: false,
    pinned: 'left',
  },
  {
    headerName: 'Alert Type',
    field: 'alert_type',
    minWidth: 130,
    cellRenderer: (params: any) => {
      const type = params.value || '';
      const colorMap: Record<string, string> = {
        S20: '#856404',
        S30: '#721c24',
        'LID TAMPERING': '#004085',
        'TANKER HOLD': '#5a2d82',
      };
      const bgMap: Record<string, string> = {
        S20: '#fff3cd',
        S30: '#f8d7da',
        'LID TAMPERING': '#cce5ff',
        'TANKER HOLD': '#e8d5f5',
      };
      const color = colorMap[type] || '#383d41';
      const bg = bgMap[type] || '#e2e3e5';
      return `<span style="background:${bg};color:${color};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">${type || '-'}</span>`;
    },
  },
  {
    headerName: 'Dispatch No',
    valueGetter: (params: any) =>
      params.data?.shipment_no || params.data?.primary_info?.shipment_no || '-',
    minWidth: 140,
  },
  {
    headerName: 'Dispatch Date',
    valueGetter: (params: any) =>
      params.data?.run_date ? params.data.run_date.split(' ')[0] : '-',
    minWidth: 130,
  },
  {
    headerName: 'Plant',
    valueGetter: (params: any) => {
      const code =
        params.data?.primary_info?.destination_code ||
        params.data?.destination_code ||
        '';
      const name = params.data?.destination_name || '';
      return code && name ? `${name} (${code})` : name || code || '-';
    },
    minWidth: 180,
  },
  {
    headerName: 'MPC',
    valueGetter: (params: any) =>
      params.data?.supplier_name ||
      params.data?.primary_info?.driver_name ||
      '-',
    minWidth: 160,
  },
  {
    headerName: 'MCC',
    valueGetter: (params: any) => {
      const code =
        params.data?.primary_info?.source_code ||
        params.data?.source_code ||
        '';
      const name = params.data?.source_name || '';
      return code && name ? `${name} (${code})` : name || code || '-';
    },
    minWidth: 180,
  },
  {
    headerName: 'Start Time',
    field: 'start_time',
    minWidth: 150,
  },
  {
    headerName: 'End Time',
    field: 'end_time',
    minWidth: 150,
  },
  {
    headerName: 'Duration (min)',
    field: 'voilation_time',
    minWidth: 130,
    valueGetter: (params: any) => {
      const v = params.data?.voilation_time;
      if (v === undefined || v === null) return '-';
      // Some entries have '00:02:30' format (LID TAMPERING)
      if (typeof v === 'string' && v.includes(':')) return v;
      return typeof v === 'number' ? Math.round(v) + ' min' : v;
    },
  },
];
