import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';

export const filterfields = (
  franchiseList: Option[] = [],
  addaList: Option[] = [],
  isAddaFilterEnabled: boolean = false,
): FieldConfig[] => [
  {
    name: 'highShipment',
    label: '',
    checkboxLabel: isAddaFilterEnabled ? 'Adda Wise' : 'Franchise Wise',
    type: 'checkbox',
    labelStyle: { 'padding-bottom': '0px' },
    class: 'col-md-2 mb-0 form-switch flex-rowi  gap-4 mt-4',
    checkboxstyle: { width: '50px', 'border-radius': '1.175rem' },
    emitValueChanges: true,
  },
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
    label: 'Franchise',
    placeholder: 'Select Franchise',
    options: franchiseList,
    bindLabel: 'name',
    class: isAddaFilterEnabled ? 'd-none' : 'col-md-2',
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
  },
  {
    headerName: 'Total Carts',
    field: 'total_cart',
    valueGetter: (params: any) => params.data?.total_cart ?? 0,
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
const dayMap: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const detailsColumns: GridColumnConfig[] = [
  {
    headerName: '#',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 40,
    pinned: 'left',
  },
  {
    headerName: 'Adda',
    field: 'adda_name',
    valueGetter: (params: any) => {
      const addaName = params.data?.adda_name || '-';
      const addaCode = params.data?.adda_code || '-';
      return `${addaName} (${addaCode})`;
    },
    minWidth: 220,
  },
  {
    headerName: 'Franchise',
    field: 'franchise_name',
    valueGetter: (params: any) => {
      const franchiseName = params.data?.franchise_name || '-';
      const franchiseCode = params.data?.franchise_code || '-';
      return `${franchiseName} (${franchiseCode})`;
    },
    minWidth: 230,
  },
  {
    headerName: 'Cart No',
    field: 'cart_no',
    valueGetter: (params: any) => params.data?.cart_no || '-',
    minWidth: 130,
  },
  {
    headerName: 'Day',
    field: 'day',
    valueGetter: (params: any) => {
      const day = params.data?.day;
      return dayMap[day as number] || '-';
    },
    width: 90,
  },
  {
    headerName: 'Region',
    field: 'region_code',
    valueGetter: (params: any) => params.data?.region_code || '-',
    width: 100,
  },
  {
    headerName: 'Start Time',
    field: 'start_time',
    valueGetter: (params: any) => params.data?.start_time || '-',
    minWidth: 170,
  },
  {
    headerName: 'End Time',
    field: 'end_time',
    valueGetter: (params: any) => params.data?.end_time || '-',
    minWidth: 170,
  },
  {
    headerName: 'Cart Start Time',
    field: 'cart_start_time',
    valueGetter: (params: any) => params.data?.cart_start_time || '-',
    minWidth: 180,
  },
  {
    headerName: 'Cart end Time',
    field: 'cart_end_time',
    valueGetter: (params: any) => params.data?.cart_end_time || '-',
    minWidth: 180,
  },
];
