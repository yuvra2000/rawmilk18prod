---
name: cell-click-modal
description: Conventions for opening modals when a cell is clicked in an AG Grid table. Use when needing to show detail data (grid, form, map, or tabs) in a modal triggered by clicking a cell value in the table.
---

# Cell Click → Modal — Project Conventions

## Overview

This project has a standard pattern for making AG Grid cells clickable and opening modals with detail data. There are **two approaches** used:

1. **Inline `cellRenderer`** — for simple clickable text (e.g., "View 5 chambers", "YES/NO alert links")
2. **`ActionCellRendererComponent`** — for icon-based action buttons (e.g., edit, delete, view)

Both approaches rely on:
- `context: { componentParent: this }` in GridConfig
- `UniversalModalService` for opening modals
- Detail data fetched via API on click

---

## 1. Required Imports

```typescript
// In the Component file
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { AlertService } from '../../../shared/services/alert.service';

// In the Config file
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';
```

---

## 2. Inline cellRenderer (Clickable Text)

Use this when a cell value itself should be clickable (e.g., a count that opens details).

### In `state-service/config.ts`:

```typescript
{
  headerName: 'No. of Chamber',
  field: 'ChmbrCnt',
  cellRenderer: (params: any) => {
    const count = params.data.ChmbrCnt || 0;
    const span = document.createElement('span');
    span.innerText = count;
    span.style.color = colors.primary;
    span.style.cursor = 'pointer';
    span.style.textDecoration = 'underline';
    span.addEventListener('click', () => {
      if (params.context?.componentParent) {
        params.context.componentParent.showChamberDetails(params.data.DispatchId);
      }
    });
    return span;
  },
},
```

### Conditional Clickability (only clickable when value meets condition):

```typescript
{
  headerName: 'Alert (Yes/No)',
  field: 'Alerts',
  cellRenderer: (params: any) => {
    const count = params.data.Alerts;
    const span = document.createElement('span');
    span.innerText = count;
    span.style.color = colors.primary;
    if (count == 'YES') {
      span.style.textDecoration = 'underline';
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.showAlertDetails(params.data.DispatchId);
        }
      });
    }
    return span;
  },
},
```

### Key Rules for Inline cellRenderer:
- Always use `document.createElement` (not template strings with innerHTML)
- Always check `params.context?.componentParent` before calling
- Always use `colors.primary` for link color (`'var(--primary)'`)
- Always add `cursor: 'pointer'` and `textDecoration: 'underline'` for clickable cells
- The method name called on `componentParent` must be defined in the component class

---

## 3. Component Methods for Modal Opening

### Pattern: Fetch Detail Data → Open Grid Modal

```typescript
private modalService = inject(UniversalModalService);
private toastService = inject(AlertService);

showChamberDetails(dispatchId: any) {
  const payload = {
    AccessToken: this.token,
    DispatchId: dispatchId,
    ForWeb: 1,
  };

  this.chamberDetailRows.set([]);

  this.myService.getChamberDetailsByDispatchId(payload).subscribe({
    next: (res: any) => {
      if (res.Status === 'success') {
        const data = res.Data || [];
        if (data.length > 0) {
          this.chamberDetailRows.set(data);
          this.modalService.openGridModal({
            title: `Chamber details`,
            columns: chamberDetailColumns,    // ← from config.ts
            rowData: this.chamberDetailRows(),
          });
        } else {
          this.chamberDetailRows.set([]);
          this.toastService.info(res.Message || 'No data found');
        }
      } else {
        this.chamberDetailRows.set([]);
        this.toastService.error(res.Message || 'Error fetching data');
      }
    },
    error: (error: any) => {
      this.toastService.error(error.message || 'Error fetching data');
    },
  });
}
```

### Pattern: Open Grid Modal with Existing Data (No API Call)

```typescript
onViewDispatches(indentData: any) {
  this.modalService.openGridModal({
    title: `Dispatches for Indent #${indentData.indent_no}`,
    columns: viewDispatchColumns,    // ← from config.ts
    rowData: indentData?.dispatchData,
  });
}
```

---

## 4. Modal Types Available via UniversalModalService

### 4a. Grid Modal — `openGridModal(config)`

Shows a data table inside a modal. Most common for detail views.

```typescript
this.modalService.openGridModal({
  title: 'Chamber Details',
  columns: chamberDetailColumns,   // GridColumnConfig[]
  rowData: this.chamberDetailRows(),
  size: 'lg',                      // 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  showFooter: false,               // hide save/cancel buttons
});
```

**GridModalConfig interface:**

| Property           | Type                  | Default  | Description                       |
|--------------------|-----------------------|----------|-----------------------------------|
| `title`            | `string`              | required | Modal header title                |
| `subtitle`         | `string`              |          | Optional subtitle                 |
| `columns`          | `GridColumnConfig[]`  | required | Column definitions for the grid   |
| `rowData`          | `any[]`               |          | Data to display                   |
| `size`             | `'sm'\|'md'\|'lg'\|'xl'\|'fullscreen'` | `'lg'` | Modal size           |
| `showFooter`       | `boolean`             | `false`  | Show save/cancel buttons          |
| `saveText`         | `string`              |          | Save button text                  |
| `cancelText`       | `string`              | `'Close'`| Cancel/close button text          |
| `selectionMode`    | `'single'\|'multiple'`|          | Row selection mode                |
| `onSelection`      | `(rows) => void`      |          | Callback when rows selected       |
| `height`           | `string`              | `'60vh'` | Grid height inside modal          |

### 4b. Form Modal — `openForm(config)`

Shows a filter/edit form inside a modal.

```typescript
this.modalService.openForm({
  title: 'Edit Indent',
  fields: this.editFieldsSignal,    // Signal<FieldConfig[]> or FieldConfig[]
  mode: 'form',
  buttonName: 'Update',
  initialData: { quantity: existingData.quantity },
  onSave: async (formData: any) => {
    // API call to save changes
  },
});
```

### 4c. Map Modal — `openMapModal(config)`

Shows a Google Map inside a modal.

```typescript
this.modalService.openMapModal({
  title: 'Location Details',
  // map-specific config
});
```

### 4d. Nav Tab Modal — `openNavTabsModal(data)`

Shows tabbed content inside a modal (each tab is a dynamic component).

```typescript
const tabs: TabConfig[] = [
  {
    title: 'Add Intent',
    component: FilterFormComponent,
    componentInputs: {
      incomingConfig: this.addIntentConfig,
    },
  },
  {
    title: 'Upload',
    component: FilterFormComponent,
    componentInputs: {
      incomingConfig: { /* ... */ },
    },
  },
];

this.modalService.openNavTabsModal({
  size: 'md',
  tabList: tabs,
  title: 'Manage Intents',
}).then((result) => {
  if (result === 'success') {
    this.loadInitialData();
  }
});
```

### 4e. Generic Component Modal — `open(component, data)`

Opens any Angular component as a modal.

```typescript
this.modalService.open(MyCustomComponent, {
  title: 'Custom Modal',
  size: 'lg',
  myCustomInput: someData,  // directly injected to component
});
```

---

## 5. CRITICAL: context.componentParent Setup

For ANY cell click to work, the `GridConfig` MUST include:

```typescript
gridConfig = signal<GridConfig>({
  theme: 'alpine',
  context: {
    componentParent: this,    // ← THIS IS REQUIRED
  },
  columns: myColumns,
});
```

Without this, `params.context.componentParent` will be `undefined` and click handlers will silently fail.

---

## 6. Defining Modal Column Configs

Define separate `GridColumnConfig[]` exports in `state-service/config.ts` for each modal:

```typescript
// Main table columns
export const mainGridColumns: GridColumnConfig[] = [ /* ... */ ];

// Modal-specific detail columns
export const chamberDetailColumns: GridColumnConfig[] = [
  { headerName: 'Chmb No', field: 'ChmbNum' },
  {
    headerName: 'Milk Dispatch Details',
    children: [
      {
        headerName: 'Qty.',
        valueGetter: (params: any) => params.data?.MilkDispatch?.Qty,
      },
      // ... more children
    ],
  },
];

export const alertDetailColumns: GridColumnConfig[] = [
  { headerName: 'Alert Type', field: 'alert_type' },
  { headerName: 'Dispatch No.', field: 'shipment_no' },
  { headerName: 'Start Time', field: 'start_time' },
  { headerName: 'End Time', field: 'end_time' },
  { headerName: 'Duration', field: 'voilation_time' },
];
```

---

## 7. Complete End-to-End Example

### config.ts

```typescript
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const mainColumns: GridColumnConfig[] = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Date', field: 'date' },
  {
    headerName: 'No. of Items',
    field: 'itemCount',
    cellRenderer: (params: any) => {
      const count = params.data.itemCount || 0;
      const span = document.createElement('span');
      span.innerText = count;
      span.style.color = colors.primary;
      span.style.cursor = 'pointer';
      span.style.textDecoration = 'underline';
      span.addEventListener('click', () => {
        if (params.context?.componentParent) {
          params.context.componentParent.showItemDetails(params.data.id);
        }
      });
      return span;
    },
  },
];

export const itemDetailColumns: GridColumnConfig[] = [
  { headerName: 'Item Name', field: 'itemName' },
  { headerName: 'Qty', field: 'qty' },
  { headerName: 'Price', field: 'price' },
];
```

### component.ts

```typescript
@Component({
  imports: [CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent],
  // ...
})
export class MyComponent {
  private myService = inject(MyService);
  private toastService = inject(AlertService);
  private modalService = inject(UniversalModalService);

  token = localStorage.getItem('AccessToken') || '';
  tableData = signal<any[]>([]);
  itemDetailRows = signal<any[]>([]);

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    context: { componentParent: this },
    columns: mainColumns,
  });

  showItemDetails(id: any) {
    const payload = { AccessToken: this.token, Id: id, ForWeb: 1 };

    this.myService.getItemDetails(payload).subscribe({
      next: (res: any) => {
        if (res.Status === 'success' && res.Data?.length > 0) {
          this.itemDetailRows.set(res.Data);
          this.modalService.openGridModal({
            title: 'Item Details',
            columns: itemDetailColumns,
            rowData: this.itemDetailRows(),
          });
        } else {
          this.toastService.info(res.Message || 'No data found');
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message || 'Error fetching details');
      },
    });
  }
}
```

---

## 8. Checklist for Cell Click → Modal

- [ ] Add `context: { componentParent: this }` to GridConfig
- [ ] Define clickable `cellRenderer` in `state-service/config.ts`
- [ ] Use `params.context?.componentParent.methodName()` pattern
- [ ] Create the handler method in the component class
- [ ] Define modal column config (`GridColumnConfig[]`) in `state-service/config.ts`
- [ ] Inject `UniversalModalService` and `AlertService`
- [ ] Use `openGridModal()` for data tables, `openForm()` for edit forms
- [ ] Handle `res.Status === 'success'` check before opening modal
- [ ] Show `toastService.info()` when no data found
- [ ] Show `toastService.error()` on API error
