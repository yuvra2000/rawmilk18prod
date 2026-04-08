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
export const cartDashboardDummyData = [
  {
    name: 'Vikash',
    total_cart: 28,
    authorised_cart: 22,
    unauthorised_cart: 4,
    delay_cart: 2,
  },
  {
    name: 'Barra',
    total_cart: 19,
    authorised_cart: 15,
    unauthorised_cart: 2,
    delay_cart: 2,
  },
  {
    name: 'Rahul',
    total_cart: 34,
    authorised_cart: 29,
    unauthorised_cart: 3,
    delay_cart: 2,
  },
  {
    name: 'MCC-12',
    total_cart: 12,
    authorised_cart: 9,
    unauthorised_cart: 1,
    delay_cart: 2,
  },
  {
    name: 'Franchise-A',
    total_cart: 41,
    authorised_cart: 35,
    unauthorised_cart: 4,
    delay_cart: 2,
  },
];
