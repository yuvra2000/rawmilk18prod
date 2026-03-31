---
name: accordion-filter-form
description: Conventions for building collapsible accordion filter forms using CollapseWrapperComponent + FilterFormComponent. Use when creating a new report page, filter panel, or any page that needs a collapsible filter section with dynamic form fields.
---

# Accordion with Filter Form — Project Conventions

## Overview

Every report/listing page in this project uses the **CollapseWrapper + FilterForm** pattern:
- `CollapseWrapperComponent` wraps filter content in a collapsible accordion panel
- `FilterFormComponent` renders dynamic form fields from a `FieldConfig[]` array
- The filter form emits submitted data, which the parent component uses to fetch/filter table data

---

## 1. File Structure

When creating a new report page, follow this structure:

```
src/app/components/rawmilk/<feature-name>/
├── state-service/
│   └── config.ts              ← FieldConfig[] + GridColumnConfig[] definitions
├── <feature-name>.component.ts
├── <feature-name>.component.html
├── <feature-name>.component.scss
└── <feature-name>.service.ts
```

All filter field definitions (`FieldConfig[]`) and grid column definitions (`GridColumnConfig[]`) go in `state-service/config.ts`, NOT in the component file.

---

## 2. Required Imports

```typescript
// Component file
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';

// Config file
import { FieldConfig, Option } from '../../../../shared/components/filter-form/filter-form.component';
```

---

## 3. Template Pattern

### Basic (Static Fields)

```html
<app-collapse-wrapper>
  <filter-form
    [dynamicFields]="filterfields()"
    (formSubmit)="onFormSubmit($event)"
  ></filter-form>
</app-collapse-wrapper>
```

### With Custom Icon in Accordion Header

```html
<app-collapse-wrapper>
  <div class="header h-5 w-5 cursor-pointer" custom-icon>
    <i class="fa fa-plus-circle icon-add" (click)="openAddModal()"></i>
  </div>
  <filter-form
    #filterRef
    [dynamicFields]="filterfields()"
    (formSubmit)="onFormSubmit($event)"
  ></filter-form>
</app-collapse-wrapper>
```

### With Value Change Listener

```html
<filter-form
  [dynamicFields]="filterfields()"
  (formSubmit)="onFormSubmit($event)"
  (controlValueChange)="onFilterChange($event)"
></filter-form>
```

---

## 4. Defining FieldConfig[] in `state-service/config.ts`

### Static Fields (no dynamic options)

```typescript
export const myFilterFields: FieldConfig[] = [
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
];
```

### Dynamic Fields (options fetched from API)

When filter options come from an API, export a **function** that accepts option lists as parameters:

```typescript
export const myFilterFields = (
  tankerName: Option[] = [],
  plantName: Option[] = [],
): FieldConfig[] => [
  {
    name: 'from',
    label: 'From Date',
    type: 'date',
    placeholder: 'Select Date',
  },
  {
    name: 'tanker',
    label: 'Tanker',
    type: 'select',
    placeholder: '--Select--',
    options: tankerName,
    bindLabel: 'VehicleNo',    // ← key from API response to display as label
  },
  {
    name: 'plant',
    label: 'Plant',
    type: 'select',
    placeholder: '--Select--',
    options: plantName,
    bindLabel: 'displayName',
  },
];
```

### Static Option Lists

```typescript
const statusList: Option[] = [
  { id: 'Active', name: 'Active' },
  { id: 'In Active', name: 'In Active' },
];
```

---

## 5. Component Signal Patterns

### Static Fields

```typescript
filterfields = signal<FieldConfig[]>(myFilterFields);
```

### Dynamic Fields (with computed)

```typescript
filterfields = computed<FieldConfig[]>(() =>
  myFilterFields(this.tankerNameList(), this.plantNameList())
);
tankerNameList = signal<any[]>([]);
plantNameList = signal<any[]>([]);
```

### Conditional Fields Based on User Type

```typescript
ngOnInit() {
  if (this.userType !== 'ChillingPlant') {
    this.filterfields.set([...baseFilterFields, ...additionalFields]);
  } else {
    this.filterfields.set([...baseFilterFields]);
  }
}
```

### Updating Field Options Dynamically

Use the shared utility function:

```typescript
import { updateFieldOptions } from '../../../shared/utils/shared-utility.utils';

// Update options for a specific field by name
updateFieldOptions(this.myFieldsSignal, 'milkType', this.state().milkList);
```

---

## 6. Available Field Types

| Type             | Usage                          | Key Properties                                    |
|------------------|--------------------------------|---------------------------------------------------|
| `text`           | Text input                     | `placeholder`, `inputFormatting`                  |
| `number`         | Number input                   | `placeholder`, `min`, `max`                       |
| `date`           | Native date picker             | `minDate`, `maxDate` (offset from today in days)  |
| `datetime`       | Native datetime-local picker   | `minDate`, `maxDate`                              |
| `time`           | Time input                     |                                                   |
| `date-spk`       | Flatpickr date picker          | `spkOptions: { mode, type, enableTime, ... }`     |
| `select`         | ng-select dropdown             | `options`, `bindLabel`, `multiple`, `addTag`      |
| `search-select`  | ng-select with async search    | `searchFn`, `multiple`, `bindLabel`               |
| `color-select`   | Color swatch selector          | `options`, `colorWidth`, `optionColorWidth`        |
| `checkbox`       | Checkbox                       | `checkboxLabel`, `checkboxstyle`                  |
| `radio`          | Radio buttons                  | `options`                                         |
| `textarea`       | Multiline text                 | `rows`                                            |
| `password`       | Password input with toggle     |                                                   |
| `email`          | Email input                    |                                                   |
| `file-upload`    | File uploader                  | `accept`, `uploadMode`, `uploadText`              |

---

## 7. Important FieldConfig Properties

| Property           | Type                      | Description                                            |
|--------------------|---------------------------|--------------------------------------------------------|
| `name`             | `string`                  | **Required.** Form control name / key in emitted data  |
| `label`            | `string`                  | **Required.** Label text displayed above the field      |
| `type`             | `FieldType`               | **Required.** Field input type                          |
| `required`         | `boolean`                 | Adds required validator                                 |
| `options`          | `Option[]`                | Dropdown options `{ id, name }`                         |
| `bindLabel`        | `string`                  | Which property to display in dropdown (default: `name`) |
| `placeholder`      | `string`                  | Placeholder text                                        |
| `multiple`         | `boolean`                 | Allow multi-select                                      |
| `disabled`         | `boolean`                 | Disable the field                                       |
| `class`            | `string`                  | **Bootstrap layout-width only** (e.g., `'col-md-6'`, `'col-md-12'`). ⚠️ **DO NOT** use this to add style-changing classes (colors, fonts, borders, visibility, etc.). Appearance is controlled exclusively by the shared `FilterFormComponent` styles — never override them via `class`. |
| `emitValueChanges` | `boolean`                 | Emit via `controlValueChange` output on change          |
| `sectionTitle`     | `string`                  | Full-width section heading before the field              |
| `forceNewLine`     | `boolean`                 | Forces field to start on new row                         |
| `actionButton`     | `object`                  | Button config with `position` and `action` callback      |

> **⚠️ IMPORTANT — `class` is for layout width ONLY**
> The `class` property in `FieldConfig` must **only** be used to set Bootstrap grid width (e.g., `'col-md-6'`). Never add classes to change colors, fonts, visibility, spacing, borders, or any other visual styling. All field appearance is governed by the shared `FilterFormComponent` stylesheet. Adding custom style classes here will cause inconsistency and is considered a pattern violation.

---

## 8. Handling Form Submission

```typescript
onFormSubmit(data: any) {
  console.log('Form submitted with data:', data);
  // data contains: { fieldName1: value1, fieldName2: value2, ... }
  // For select fields, value is the full option object, e.g., data.tanker.VehicleId
  this.getTableData(data);
}
```

---

## 9. Common Patterns

### Filter Form in a Modal (using incomingConfig)

```typescript
this.modalService.openForm({
  title: 'Edit Item',
  fields: this.editFieldsSignal,
  mode: 'form',
  buttonName: 'Update',
  initialData: { quantity: existingData.quantity },
  onSave: async (formData: any) => {
    // handle save
  },
});
```

### Populating Form with Initial Data

```typescript
initialData = input<any | null>(null);

// Pass via template:
// [initialData]="someData"

// Or via incomingConfig:
// initialData: { fieldName: value }
```

---

## 10. Checklist for New Filter Forms

- [ ] Create `state-service/config.ts` with `FieldConfig[]` export
- [ ] Use function export if options are dynamic (fetched from API)
- [ ] Define `filterfields` as `signal` (static) or `computed` (dynamic)
- [ ] Add `CollapseWrapperComponent` and `FilterFormComponent` to component imports
- [ ] Use `[dynamicFields]` binding (not `[fields]`)
- [ ] Handle `(formSubmit)` event
- [ ] For select fields, remember `data.fieldName` is the full option object — access `.id`, `.name`, etc.
- [ ] **Do NOT use `class` for styling** — only use it for Bootstrap width (e.g., `'col-md-6'`). Never add style-changing classes to `FieldConfig`.
