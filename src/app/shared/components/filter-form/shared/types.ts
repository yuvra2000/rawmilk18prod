import { Observable } from 'rxjs';
import { InputFormatConfig } from '../../../directives/input-format.directive';

export interface Option {
  id: string | number;
  name: string;
}

export type FieldType =
  | 'search-select'
  | 'text'
  | 'date'
  | 'select'
  | 'toggle'
  | 'checkbox'
  | 'radio'
  | 'number'
  | 'textarea'
  | 'password'
  | 'file-upload'
  | 'email'
  | 'date-spk'
  | 'time'
  | 'color-select'
  | 'datetime'
  | 'formarray'
  | 'month'
  | 'year';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: Option[];
  placeholder?: string;
  searchFn?: (query: string) => Observable<Option[]>;
  loading?: boolean;
  class?: string;
  required?: boolean;
  showError?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  checkboxLabel?: string;
  rows?: number;
  multiple?: boolean;
  disabled?: boolean;
  emitValueChanges?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxFiles?: number;
  uploadText?: string;
  allowedExtensions?: string[];
  uploadMode?: 'image' | 'file' | 'any';
  displayMode?: 'form' | 'modal-form'; // ✅ NEW: To control display mode for file upload
  dateRole?: 'start' | 'end';
  inputFormatting?: InputFormatConfig;
  spkOptions?: SpkOptions;
  minDate?: number;
  maxDate?: number;
  isOpen?: boolean;
  bindLabel?: string;
  bindValue?: string;
  min?: number;
  max?: number;
  slectConfig?: SelectConfig;
  // ✅ FormArray specific properties
  formArrayFields?: FieldConfig[]; // Sub-fields for formarray
  minItems?: number; // Minimum number of items in array
  maxItems?: number; // Maximum number of items in array
  defaultItems?: number; // Number of default items to create when form array is initialized
  showLabelOnlyFirst?: boolean; // Show sub-field labels only on first item, hide on rest
  addButtonText?: string; // Text for add button
  removeButtonText?: string; // Text for remove button
  // ✅ NEW: Button configuration
  actionButton?: {
    text?: string; // Button text
    icon?: string; // Icon class (e.g., 'ri-add-line')
    position?: 'label' | 'after-field' | 'separate-col'; // Position
    class?: string; // Custom CSS class
    action: (fieldName?: any) => void; // Click handler (accepts optional arg)     // Click handler
    disabled?: boolean; // Disabled state
    tooltip?: string; // Tooltip text
    iconText?: string;
    showOnlyIcon?: boolean;
  };
  // ✅ NEW: Dynamic Label Styling
  labelClass?: string; // Custom class for the label
  labelStyle?: Record<string, string | number>; // Dynamic inline styles
  forceNewLine?: boolean; // Force field to start on a new line
  sectionTitle?: string;
  sectionTitleClass?: string; // Custom CSS class for section title
  sectionTitleStyle?: Record<string, string | number>; // Dynamic inline styles for section title
  addTag?: boolean | ((term: string) => any | Promise<any>); // Title for section headers
  addTagText?: string;
  checkboxstyle?: Record<string, string | number>;
  colorWidth?: string; // Custom width for color select (e.g. '100%', '50px')
  optionColorWidth?: string;
  showButtons?: boolean;
  hideLabel?: boolean;
  toggleLabels?: {
    on: string;
    off: string;
  };
  toggleValues?: {
    on: any;
    off: any;
  };
}

export interface SpkOptions {
  altInput?: boolean;
  convertModelValue?: boolean;
  enableTime?: boolean;
  dateFormat?: string;
  minDate?: any;
  maxDate?: any;
  mode?: 'single' | 'multiple' | 'range';
  placeholder?: string;
  // ✅ NEW: Specific dates ko disable karne ke liye (e.g., Sundays)
  disable?: any[];
  // ✅ NEW: Date, Month ya Year picker switch karne ke liye
  type?: 'date' | 'month' | 'year';
  // ✅ NEW: Agar month selector use kar rahe ho toh
  shorthand?: boolean;
}
export interface SelectConfig {
  enableExclusiveAll?: boolean;
  allOptionValue?: any;
  // Kal ko 'Select All' label ya search placement add karna ho toh yahan aayega
}
