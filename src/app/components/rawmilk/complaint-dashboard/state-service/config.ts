import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

export const complaintFilterFields: FieldConfig[] = [
  {
    name: 'from',
    label: 'From Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
  {
    name: 'to',
    label: 'To Date',
    type: 'date',
    required: true,
    maxDate: -1,
  },
];
