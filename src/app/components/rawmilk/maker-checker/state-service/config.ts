import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';
const statusList: Option[] = [];
// Filter field configuration based on requirements
export const filterfields = (
  userList: Option[] = [],
  makerCheckerList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'userId',
    type: 'select',
    label: 'User',
    placeholder: 'Select User',
    options: userList,
    class: 'col-md-2',
    emitValueChanges: true,
  },
  {
    name: 'maker_checker',
    type: 'select',
    label: 'Maker/Checker',
    placeholder: 'Select Maker/Checker',
    options: makerCheckerList,
    class: 'col-md-2',
  },
];
// Grid column configuration based on actual data structure
export const mccMappingColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'srNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,

    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Name',
    field: 'name',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'User Name',
    field: 'username',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'User Type',
    field: 'user_type',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Type',
    field: 'maker_checker_type',
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Action',
    field: 'action',
    // pinned: 'right',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa fa-trash',
          tooltip: 'Delete',
          onClick: (data: any, node: any, params: any) => {
            const parent = params?.context?.componentParent;
            if (parent && typeof parent.deleteMapping === 'function') {
              parent.deleteMapping(data);
            }
          },
          iconStyle: {
            color: colors.danger,
            cursor: 'pointer',
            fontSize: '18px',
          },
        },
      ],
    },
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
    sortable: false,
    filter: false,
  },
];
export const ChillingMakerCheckerStatus = [
  {
    id: 1,
    name: 'Maker',
  },
  {
    id: 3,
    name: 'New Dispatcher',
  },
];
export const RemMakerCheckerStatus = [
  {
    id: 1,
    name: 'Maker',
  },
  {
    id: 2,
    name: 'Checker',
  },
  {
    id: 3,
    name: 'New Dispatcher',
  },
];
