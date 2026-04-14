import {
  GridColumnConfig,
  StatusCellRendererComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { ActionCellRenderer } from '../../../../shared/components/ag-grid/renderers';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import { TooltipField } from './utils';

const cartTooltipFields: TooltipField[] = [
  { label: 'Name', key: 'name' },
  { label: 'Code', key: 'code' },
  { label: 'Geo Coord', key: 'latlng' },
];
const InchargeTooltipFields: TooltipField[] = [
  { label: 'Incharge Name', key: 'adda_code' },
];

export const filterfields = (
  franchiseList: Option[] = [],
  addaList: Option[] = [],
  regionList: Option[] = [],
  isAddaFilterEnabled: boolean = false,
): FieldConfig[] => [
  {
    name: 'adda_code',
    type: 'select',
    label: 'Adda',
    placeholder: 'Select Adda',
    options: addaList,
    bindLabel: 'name',
    class: isAddaFilterEnabled ? 'col-md-2' : ' d-none',
  },
  {
    name: 'franchise_code',
    type: 'select',
    label: 'VRS',
    placeholder: 'Select VRS',
    options: franchiseList,
    bindLabel: 'name',
    class: isAddaFilterEnabled ? 'd-none' : 'col-md-2',
  },
  {
    name: 'region',
    type: 'select',
    label: 'Region',
    placeholder: 'Select Region',
    options: regionList,
  },
];
// export const gridColumns: GridColumnConfig[] = [];
export const gridColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
  },
  {
    headerName: 'Name',
    field: 'name',
    valueGetter: (params: any) => params.data?.name || '-',
    tooltipValueGetter: (params: any) => {
      console.log('Tooltip params:', params);
      return params.data?.adda_incharge || params.data?.name || '-';
    },
    tooltipComponentParams: (params: any) => ({
      tooltip: params.data,
      header: 'Detail',
      tooltipFields: cartTooltipFields,
    }),
    cellStyle: {
      cursor: 'pointer',
      color: '#1d4380',
    },
  },
  {
    headerName: 'Total Carts',
    field: 'total_cart',
    valueGetter: (params: any) => params.data?.total_cart ?? 0,
    cellStyle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: '#1d4380',
      color: '#1d4380',
    },
    onCellClicked: (params: any) => {
      params.context?.componentParent?.viewDetails?.(params.data, 'total');
    },
  },
  {
    headerName: 'Authorised Carts',
    field: 'authorised_cart',
    valueGetter: (params: any) => params.data?.authorised_cart ?? 0,

    cellStyle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: '#1d4380',
      color: '#1d4380',
    },
    onCellClicked: (params: any) => {
      params.context?.componentParent?.viewDetails?.(params.data, 'authorised');
    },
  },
  {
    headerName: 'Un-authorised Carts',
    field: 'unauthorised_cart',
    valueGetter: (params: any) => params.data?.unauthorised_cart ?? 0,

    cellStyle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: '#1d4380',
      color: '#1d4380',
    },
    onCellClicked: (params: any) => {
      params.context?.componentParent?.viewDetails?.(
        params.data,
        'unauthorised',
      );
    },
  },
  {
    headerName: 'Delay Carts',
    field: 'delay_cart',
    valueGetter: (params: any) => params.data?.delay_cart ?? 0,
    width: 240,
    cellStyle: {
      cursor: 'pointer',
      textDecoration: 'underline',
      textDecorationColor: '#1d4380',
      color: '#1d4380',
    },
    onCellClicked: (params: any) => {
      params.context?.componentParent?.viewDetails?.(params.data, 'delay');
    },
  },
];
export const delayColumns: GridColumnConfig[] = [
  {
    headerName: 'Delay',
    field: 'delay_status',
    valueGetter: (params: any) => params.data?.delay_status || '-',
    cellRenderer: StatusCellRendererComponent,
    cellRendererParams: {
      status: (params: any) =>
        params.data?.delay_status == 'NO' ? 'inactive' : 'active',
    },
  },
];
export const statusColumns: GridColumnConfig[] = [
  {
    headerName: 'Status',
    field: 'status',
    valueGetter: (params: any) =>
      Number(params.data?.status) == 1 ? 'Authorized' : 'Unauthorized',
    cellRenderer: StatusCellRendererComponent,
    cellRendererParams: {
      status: (params: any) =>
        Number(params?.data?.status) === 1 ? 'active' : 'inactive',
    },
  },
];
export const detailsColumns: GridColumnConfig[] = [
  {
    headerName: '#',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 80,
    pinned: 'left',
  },

  {
    headerName: 'Cart No',
    field: 'cart_no',
    valueGetter: (params: any) => params.data?.cart_no || '-',
    minWidth: 130,
  },
  {
    headerName: 'Scheduled Time',
    field: 'scheduled_time',
    valueGetter: (params: any) => {
      const startTime = params.data?.start_time?.split(' ')[1] || '-';
      const endTime = params.data?.end_time?.split(' ')[1] || '';
      return params.data?.scheduled_time || `${startTime} - ${endTime}` || '-';
    },
    minWidth: 130,
  },
  {
    headerName: 'Actual Time',
    field: 'actual_time',
    valueGetter: (params: any) => {
      const startTime = params.data?.cart_start_time?.split(' ')[1] || '-';
      const endTime = params.data?.cart_end_time?.split(' ')[1] || '';
      return params.data?.actual_time || `${startTime} - ${endTime}` || '-';
    },
    minWidth: 130,
  },
  {
    headerName: 'Adda',
    field: 'adda_name',
    valueGetter: (params: any) => {
      const addaName = params.data?.adda_name || '-';
      const addaCode = params.data?.adda_code || '-';
      return `${addaName} (${addaCode})`;
    },
    tooltipValueGetter: (params: any) => {
      return (
        `Incharge: ${params.data?.adda_name}` ||
        `Incharge: ${params.data?.adda_incharge}` ||
        '-'
      );
    },
    minWidth: 220,
    cellStyle: {
      cursor: 'pointer',
      color: '#1d4380',
    },
  },
  {
    headerName: 'Franchise',
    field: 'franchise_name',
    valueGetter: (params: any) => {
      const franchiseName = params.data?.franchise_name || '-';
      const franchiseCode = params.data?.franchise_code || '-';
      return `${franchiseName} (${franchiseCode})`;
    },
    tooltipValueGetter: (params: any) => {
      return (
        `Incharge: ${params.data?.franchise_name}` ||
        `Incharge: ${params.data?.franchise_incharge}` ||
        '-'
      );
    },

    cellStyle: {
      cursor: 'pointer',
      color: '#1d4380',
    },
    minWidth: 230,
  },
];
export const cartDetailsColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    headerTooltip: 'Serial Number',
    valueGetter: (params: any) => params.node.rowIndex + 1,
  },
  {
    headerName: 'Cart Number',
    field: 'cart_no',
    valueGetter: (params: any) => params.data?.cart_no || '-',
  },
];
export const addaDetailsColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    headerTooltip: 'Serial Number',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
  },
  {
    headerName: 'Adda Code',
    field: 'adda_code',
    valueGetter: (params: any) => params.data?.adda_code || '-',
  },
];
export const franchiseDetailsColumns: GridColumnConfig[] = [
  {
    headerName: 'S No',
    headerTooltip: 'Serial Number',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
  },
  {
    headerName: 'Franchise Name',
    field: 'franchise_name',
    valueGetter: (params: any) => params.data?.franchise_name || '-',
  },
];
