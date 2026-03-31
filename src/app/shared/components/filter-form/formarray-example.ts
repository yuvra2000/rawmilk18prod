// Example usage of FormArray in filter-form component

import { FieldConfig } from './shared/types';

// Example: Milk Testing Form with FormArray for multiple milk samples
export const milkTestingFormConfig: FieldConfig[] = [
  {
    name: 'farmerName',
    label: 'Farmer Name',
    type: 'text',
    required: true,
    class: 'col-md-6',
  },
  {
    name: 'testDate',
    label: 'Test Date',
    type: 'date',
    required: true,
    class: 'col-md-6',
  },
  {
    name: 'milkSamples',
    label: 'Milk Sample',
    type: 'formarray',
    required: true,
    class: 'col-12',
    minItems: 1, // Minimum 1 item must be present
    maxItems: 5, // Maximum 5 items allowed
    addButtonText: 'Add Milk Sample',
    removeButtonText: 'Remove Sample',
    formArrayFields: [
      {
        name: 'milkType',
        label: 'Milk Type',
        type: 'select',
        required: true,
        class: 'col-md-4',
        options: [
          { id: 'cow', name: 'Cow Milk' },
          { id: 'buffalo', name: 'Buffalo Milk' },
          { id: 'mixed', name: 'Mixed Milk' },
        ],
      },
      {
        name: 'quantity',
        label: 'Quantity (L)',
        type: 'number',
        required: true,
        min: 0.1,
        class: 'col-md-2',
        placeholder: 'Enter Quantity',
      },
      {
        name: 'fat',
        label: 'Fat %',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        class: 'col-md-2',
        placeholder: 'Enter Fat %',
      },
      {
        name: 'snf',
        label: 'SNF %',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        class: 'col-md-2',
        placeholder: 'Enter SNF %',
      },
      {
        name: 'mbrt',
        label: 'MBRT',
        type: 'text',
        required: false,
        class: 'col-md-2',
        placeholder: 'Enter MBRT',
      },
    ],
  },
];

/*
Usage in component:

export class YourComponent {
  filterConfig: FilterFormConfig = {
    fields: milkTestingFormConfig,
    buttonName: 'Save Test Results',
    onSave: (data) => {
      console.log('Form Data:', data);
      // data will contain:
      // {
      //   farmerName: 'John Doe',
      //   testDate: '2024-01-15',
      //   milkSamples: [
      //     {
      //       milkType: 'cow',
      //       quantity: 10,
      //       fat: 4.5,
      //       snf: 8.2,
      //       mbrt: 'Pass'
      //     },
      //     // ... more samples
      //   ]
      // }
    }
  };
}

// In template:
// <filter-form [incomingConfig]="filterConfig"></filter-form>
*/
