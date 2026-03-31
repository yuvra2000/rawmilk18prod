import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';

export const inventoryFilterFields: FieldConfig[] = [
  {
    name: 'from',
    type: 'date',
    label: 'From Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'to',
    type: 'date',
    label: 'To Date',
    placeholder: 'Select Date',
    required: true,
  },
  {
    name: 'mcc',
    type: 'select',
    label: 'Mcc Name',
    placeholder: 'Select Mcc Name',
    options: [],
  },
  {
    name: 'milkType',
    type: 'select',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    options: [],
  },
  {
    name: 'category',
    type: 'select',
    label: 'Category',
    placeholder: 'Select Category',
    options: [],
  },
];
