import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';

/**
 * Dynamic filter configuration for Remote Lock-Unlock
 * Accepts tanker options from API
 */
export const remoteFilterFields = (tankerOptions: Option[] = []): FieldConfig[] => [
  {
    name: 'tanker',
    label: 'Select Tanker',
    type: 'select',
    placeholder: 'Select a tanker',
    options: tankerOptions,
    required: true,
    bindLabel: 'name',
  },
];
