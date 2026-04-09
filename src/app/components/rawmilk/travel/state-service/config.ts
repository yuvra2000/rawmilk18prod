import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';

export const travelfeilds: FieldConfig[] = [
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
    name: 'Plant',
    type: 'select',
    label: 'Plant',
    placeholder: 'Select Plant',
    options: [], // 🔥 dynamic
    bindLabel: 'displayName',
  },
  {
    name: 'transporter',
    type: 'select',
    label: 'Transporter',
    placeholder: 'Select Transporter',
    options: [], // 🔥 dynamic
    bindLabel: 'TransporterName',
  },
];
