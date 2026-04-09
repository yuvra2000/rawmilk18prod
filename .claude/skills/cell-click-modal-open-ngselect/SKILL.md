# Cell Click Open NgSelect Modal Skill

## Overview
This skill documents the convention for opening a modal with **variable ng-select dropdowns and input fields** when an Action cell is clicked in an AG Grid table. The modal:
- Supports 1 to N ng-select fields (dynamically configurable)
- Supports variable input fields (text, textarea, numbers, dates, etc.)
- Loads ng-select options from API on modal open
- Submits form data to API
- Reloads parent grid data on success

**Use Case**: Perform bulk or single-row actions like status changes, role assignments, reassignments, or any workflow action requiring flexible field selection.

---

## Architecture & Pattern

### 1. **Grid Column Configuration** (`config.ts`)
Define the action column with cell click handler:

```typescript
import { GridColumnConfig } from 'path/to/GridColumnConfig';
import { ActionCellRendererComponent } from 'path/to/ActionCellRendererComponent';
import { colors } from 'path/to/colors';

export const actionColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      {
        icon: 'fa-solid fa-pen-to-square',
        action: 'edit',
        tooltip: 'Edit Item',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onActionClick(params.data);
          }
        },
        iconStyle: { color: colors.primary, cursor: 'pointer' },
      },
    ],
  },
};
```

**Key Points**:
- `onClick` must access `params.context.componentParent` to call the component method
- Pass `params.data` (the full row data) to the handler

---

### 2. **Field Configuration** (`config.ts`)
Define field configuration arrays that will be dynamically rendered:

```typescript
import { FieldConfig } from 'path/to/filter-form.component';

// Example: Multiple ng-select fields + input fields
export const actionModalFields: FieldConfig[] = [
  {
    fieldName: 'status',
    label: 'Select Status',
    type: 'ng-select',
    required: true,
    options: [], // Will be populated from API
    placeholder: 'Choose status...',
  },
  {
    fieldName: 'assignedUser',
    label: 'Assign To',
    type: 'ng-select',
    required: true,
    options: [], // Will be populated from API
    placeholder: 'Choose user...',
  },
  {
    fieldName: 'remarks',
    label: 'Remarks',
    type: 'textarea',
    required: false,
    placeholder: 'Add optional remarks...',
  },
  {
    fieldName: 'dueDate',
    label: 'Due Date',
    type: 'date',
    required: false,
  },
];
```

**Field Types Supported**:
- `ng-select`: Dropdown with API-populated options
- `text`: Standard text input
- `textarea`: Multi-line text
- `number`: Numeric input
- `date`: Date picker
- `email`: Email input
- Custom types as defined in FilterFormComponent

---

### 3. **Component Implementation**

#### A. **Signal for Modal Fields**
```typescript
import { signal } from '@angular/core';
import { actionModalFields } from './config';

export class YourComponent implements OnInit {
  modalFields = signal<FieldConfig[]>(actionModalFields);
  // ... other signals
}
```

#### B. **Modal Open Handler**
```typescript
async onActionClick(data: any) {
  try {
    // Step 1: Load options from API
    const apiOptions = await this.loadApiOptions();
    
    // Step 2: Populate field options dynamically
    this.updateFieldOptions(this.modalFields, 'status', apiOptions.statusList);
    this.updateFieldOptions(this.modalFields, 'assignedUser', apiOptions.userList);
    
    // Step 3: Open modal with onSave callback
    this.modalService.openForm({
      title: 'Perform Action',
      fields: this.modalFields(),
      mode: 'form',
      buttonName: 'Submit',
      initialData: {
        status: data.currentStatus, // Pre-fill if applicable
      },
      onSave: async (formData: any) => {
        await this.handleFormSubmit(formData, data.id);
      },
    });
  } catch (error: any) {
    handleApiError(
      error,
      this.toastService,
      'Failed to open action modal'
    );
  }
}

private async loadApiOptions(): Promise<any> {
  const token = localStorage.getItem('AccessToken') || '';
  const response = await firstValueFrom(
    this.yourService.getOptionsData({
      AccessToken: token,
      ForApp: '0',
    })
  );
  return response;
}

private updateFieldOptions(
  fieldsSignal: Signal<FieldConfig[]>,
  fieldName: string,
  options: any[]
) {
  const formattedOptions = options.map(item => ({
    id: item.id || item.code,
    name: item.name || item.label,
  }));
  
  updateFieldOptions(fieldsSignal, fieldName, formattedOptions);
}
```

#### C. **Form Submit Handler**
```typescript
private async handleFormSubmit(formData: any, rowId: any) {
  try {
    const token = localStorage.getItem('AccessToken') || '';
    const payload = {
      AccessToken: token,
      id: rowId,
      status: formData.status?.id || formData.status,
      assignedUser: formData.assignedUser?.id || formData.assignedUser,
      remarks: formData.remarks || '',
      dueDate: formData.dueDate || '',
      ForApp: '0',
    };
    
    const res: any = await firstValueFrom(
      this.yourService.updateActionData(payload)
    );
    
    handleApiResponse(
      res,
      this.toastService,
      () => this.loadInitialData(), // Reload grid data
      undefined,
      'Action performed successfully'
    );
  } catch (error: any) {
    handleApiError(
      error,
      this.toastService,
      'Failed to perform action'
    );
  }
}
```

---

### 4. **Service Method** (`your.service.ts`)

```typescript
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class YourService {
  constructor(private http: HttpClient) {}

  getOptionsData(params: any): Observable<any> {
    return this.http.post<any>('/api/endpoint/get-options', params);
  }

  updateActionData(payload: any): Observable<any> {
    return this.http.post<any>('/api/endpoint/update-action', payload);
  }
}
```

---

### 5. **Template Integration** (if needed)

```html
<div class="action-buttons">
  <button 
    (click)="onActionClick(rowData)"
    class="btn btn-sm btn-primary"
  >
    Perform Action
  </button>
</div>
```

---

## Best Practices

### ✅ Do's
1. **Load options once**: Fetch all required options in `loadApiOptions()` to reduce API calls
2. **Pre-format options**: Ensure options follow `{id, name}` structure before passing to ng-select
3. **Handle missing options**: Set empty array `[]` for fields and update after API response
4. **Type safety**: Use interfaces for field configuration and modal response
5. **User feedback**: Use toast/alert service for success/error messages
6. **Reload on success**: Always call `loadInitialData()` in success callback to reflect changes
7. **Handle edge cases**: Check for null/undefined values when accessing option properties

### ❌ Don'ts
1. **Don't fire multiple API calls per field**: Batch API calls with `forkJoin` if possible
2. **Don't mutate original config**: Always create new array when updating field signals
3. **Don't leave fields unvalidated**: Use form validation from FilterFormComponent wrapper
4. **Don't ignore API errors**: Always provide user feedback for failures
5. **Don't hardcode option properties**: Use configurable mapping (id, name, code, etc.)

---

## Error Handling Pattern

```typescript
async onActionClick(data: any) {
  try {
    const apiOptions = await this.loadApiOptions();
    
    if (!apiOptions || !apiOptions.statusList) {
      throw new Error('Failed to load required options');
    }
    
    this.updateFieldOptions(this.modalFields, 'status', apiOptions.statusList);
    
    // ... open modal
  } catch (error: any) {
    handleApiError(error, this.toastService, 'Failed to open action modal');
  }
}

private async handleFormSubmit(formData: any, rowId: any) {
  try {
    if (!formData || !rowId) {
      throw new Error('Invalid form data or row ID');
    }
    
    const payload = this.buildPayload(formData, rowId);
    const res: any = await firstValueFrom(this.yourService.updateActionData(payload));
    
    handleApiResponse(
      res,
      this.toastService,
      () => this.loadInitialData(),
      undefined,
      'Action performed successfully'
    );
  } catch (error: any) {
    handleApiError(error, this.toastService, 'Failed to perform action');
  }
}
```

---

## Payload Mapping Strategy

Use a flexible mapping function to handle variable field types:

```typescript
private buildPayload(formData: any, rowId: any): any {
  const token = localStorage.getItem('AccessToken') || '';
  const basePayload = {
    AccessToken: token,
    id: rowId,
    ForApp: '0',
  };
  
  // Map all form fields dynamically
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    // Handle ng-select objects (extract id)
    if (value && typeof value === 'object' && value.id) {
      basePayload[key] = value.id;
    }
    // Handle other values
    else if (value !== null && value !== undefined && value !== '') {
      basePayload[key] = value;
    }
  });
  
  return basePayload;
}
```

---

## UI/UX Considerations

1. **Modal Size**: Use `size: 'md'` or `'lg'` depending on field count
2. **Loading State**: Show spinner while loading API options
3. **Validation Messages**: Display field-level validation errors
4. **Disabled State**: Disable submit button while API is processing
5. **Confirmation**: Consider adding confirmation modal for critical actions

---

## Example: Complete Implementation

See the **`view-indent.component.ts` → `onEditIndent()` method** and **`config.ts`** in this codebase as a working reference for this pattern.

---

## Testing Checklist

- [ ] Modal opens on action cell click
- [ ] API options load and populate dropdowns
- [ ] Form validation works (if required fields present)
- [ ] Submit calls correct API endpoint
- [ ] Grid reloads after successful submission
- [ ] Error messages display correctly
- [ ] Modal closes after success
- [ ] Pre-filled values appear in form (if applicable)
- [ ] Handle network errors gracefully
- [ ] Support variable number of ng-selects (1-N)
- [ ] Support variable input field types

