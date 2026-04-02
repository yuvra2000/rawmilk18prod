import { FieldConfig } from '../../../../../shared/components/filter-form/filter-form.component';

export const addProjectionFieldsModal: FieldConfig[] = [
  {
    name: 'date',
    type: 'date',
    label: 'Date',
    placeholder: 'Select Date',
    class: 'col-md-6',
    disabled: true,
  },
  {
    name: 'milkType',
    type: 'text',
    label: 'Milk Type',
    placeholder: 'Select Milk Type',
    class: 'col-md-6',
    disabled: true,
  },
  {
    name: 'mcc',
    type: 'text',
    label: 'MCC',
    placeholder: 'Select MCC',
    class: 'col-md-6',
    disabled: true,
  },
  {
    name: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter Quantity',
    class: 'col-md-6',
  },
];
export const editProjectionFields: FieldConfig[] = [
  {
    name: 'date',
    type: 'date',
    label: 'Projection Date',
    placeholder: 'Select Date',
    class: 'col-md-6',
    disabled: true,
  },
  {
    name: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter Quantity',
    class: 'col-md-6',
  },
];
