import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const filterfields = (
  vehicleList: Option[] = [],
  transporterList: Option[] = [],
  mccList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'TransporterId',
    type: 'select',
    label: 'Transporter',
    placeholder: 'Select Transporter',
    options: transporterList,
    bindLabel: 'name',
    class: 'col-md-3',
  },
  {
    name: 'AgreementMapVeh',
    type: 'select',
    label: 'Vehicle',
    placeholder: 'Select Vehicle',
    options: vehicleList,
    class: 'col-md-3',
  },
  {
    name: 'AgreementCode',
    type: 'text',
    label: 'Agreement Number',
    placeholder: 'Enter Agreement Number',
    class: 'col-md-3',
  },
  {
    name: 'PreferredMcc',
    type: 'select',
    label: 'MCC',
    placeholder: 'Select MCC',
    options: mccList,
    class: 'col-md-3',
    bindLabel: 'displayName',
  },
  {
    name: 'AgreementStartDate',
    type: 'date',
    label: 'Start Date',
    placeholder: 'Select Start Date',
    class: 'col-md-3',
  },
  {
    name: 'AgreementEndDate',
    type: 'date',
    label: 'End Date',
    placeholder: 'Select End Date',
    class: 'col-md-3',
  },
  {
    name: 'VehAvgDistance',
    type: 'number',
    label: 'Average Distance Travelled',
    placeholder: 'Enter Average Distance',
    class: 'col-md-3',
  },
];
// export const cartColumns: GridColumnConfig[] = [];
export const cartColumns: GridColumnConfig[] = [
  {
    headerName: 'Sr No',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    minWidth: 90,
    maxWidth: 110,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Agreement Code',
    field: 'AgreementCode',
    minWidth: 180,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Prefferd Mcc',
    field: 'MccNameCode',
    minWidth: 180,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Vehicle',
    field: 'MappedVehicles',
    minWidth: 180,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Agreement Start Date',
    field: 'AgreementStartDate',
    minWidth: 170,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Agreement End Date',
    field: 'AgreementEndDate',
    minWidth: 170,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'VehAvgDistance',
    field: 'VehAvgDistance',
    headerTooltip: 'Average Distance Travelled by Vehicle',
    minWidth: 160,
    cellStyle: { textAlign: 'center' },
    headerClass: 'text-center',
  },
  {
    headerName: 'Action',
    field: 'action',
    minWidth: 110,
    maxWidth: 130,
    pinned: 'right',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      actions: [
        {
          icon: 'fa fa-trash',
          tooltip: 'Delete',
          onClick: (data: any, node: any, params: any) => {
            const parent = params?.context?.componentParent;
            if (parent && typeof parent.deleteaggrement === 'function') {
              parent.deleteaggrement(data);
            } else if (parent && typeof parent.deleteAgreement === 'function') {
              parent.deleteAgreement(data);
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
