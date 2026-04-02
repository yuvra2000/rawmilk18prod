import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
export const userType = localStorage.getItem('usertype') || '';
const dispatchLocOptions: Option[] = [
  { name: 'YES', id: 'YES' },
  { name: 'NO', id: 'NO' },
];
const roleOptions: Option[] = [
  { name: 'Mpc wise', id: 'MPC' },
  { name: 'Mcc wise', id: 'MCC' },
  { name: 'Dispatch Loc wise', id: 'DISLOC' },
];
export const filterfields = (
  mccList: Option[] = [],
  milkTypeList: Option[] = [],
  supplierList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'month',
    type: 'month',
    label: 'Month',
    placeholder: 'Select Month',
  },
  {
    name: 'supplier',
    type: 'select',
    label: 'Supplier Name',
    placeholder: 'Select Supplier Name',
    options: supplierList,
    bindLabel: 'displayName',
    class:
      userType == 'Supplier' || userType == 'ChillingPlant'
        ? 'd-none'
        : 'col-md-2', // Hide for suppliers, show for others
    emitValueChanges: true,
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc Name',
    placeholder: 'Select Mcc Name',
    options: mccList,
    bindLabel: 'name',
    class: userType == 'ChillingPlant' ? 'd-none' : 'col-md-2', // Hide for MCC users, show for others
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
  },
  {
    name: 'dispatchLoc',
    type: 'select',
    label: 'Dispatch Location',
    placeholder: 'Select Dispatch Location',
    options: dispatchLocOptions,
  },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    placeholder: 'Select Role',
    options: roleOptions,
  },
];
export const addProjectionFields = (
  mccList: Option[] = [],
  milkTypeList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc Name',
    placeholder: 'Select Mcc Name',
    options: mccList,
    bindLabel: 'name',
    class: 'col-md-6',
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: milkTypeList,
    bindLabel: 'name',
    class: 'col-md-6',
  },
  {
    name: 'projections',
    label: 'Projections',
    type: 'formarray',
    required: true,
    class: 'col-12',
    minItems: 1,
    defaultItems: 8,
    showLabelOnlyFirst: true,
    labelClass: 'font-weight-bold ',
    formArrayFields: [
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        class: 'col-md-6',
        disabled: true,
      },
      {
        name: 'quantity',
        label: 'Quantity (L)',
        type: 'number',
        required: true,
        min: 0,
        class: 'col-md-6',
        placeholder: 'Enter Quantity',
      },
    ],
  },
];
