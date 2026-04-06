import {
  FieldConfig,
  Option,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';
export const statusList: Option[] = [
  { name: 'In Transit', id: 'INTRANSIT' },
  { name: 'To be dispatched', id: 'TOBEDISPH' },
];
export const filterfields = (
  milkList: Option[] = [],
  tankerList: Option[] = [],
  destinationList: Option[] = [],
): FieldConfig[] => [
  {
    name: 'dispatchDetails',
    label: 'Dispatch Details',
    type: 'formarray',
    required: true,
    class: 'col-12',
    minItems: 1,
    showLabelOnlyFirst: true,
    formArrayFields: [
      {
        type: 'select',
        name: 'tanker',
        label: 'Tanker No.',
        options: tankerList,
        class: 'col equal-col',
      },
      {
        type: 'select',
        name: 'milk',
        label: 'Milk Type',
        options: milkList,
        class: 'col equal-col',
      },
      {
        type: 'date',
        name: 'arrival_date',
        label: 'Arrival Date',
        class: 'col equal-col',
      },
      {
        type: 'time',
        name: 'arrival_time',
        label: 'Arrival Time',
        class: 'col equal-col',
      },
      {
        type: 'number',
        name: 'quantity',
        label: 'Quantity',
        class: 'col equal-col',
      },
      {
        type: 'select',
        name: 'status',
        label: 'Status',
        options: statusList,
        class: 'col equal-col',
      },
      {
        type: 'select',
        name: 'destination',
        label: 'Destination',
        options: destinationList,
        class: 'col equal-col-lastt',
      },
    ],
  },
];
export const masterFilterParams = createFormData(token, {
  GroupId: GroupId,
  ForApp: '0',
});
export const tankerFilterParams = createFormData(token, {
  GroupId: GroupId,
  ForApp: '0',
});
