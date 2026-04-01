---
name: ag-grid-table
description: Conventions for configuring and populating AG Grid tables using the AdvancedGridComponent wrapper. Use when creating a new data table, report grid, or any page that displays tabular data with AG Grid.
---

# AG Grid Table — Project Conventions

## Overview

This project uses a custom `AdvancedGridComponent` wrapper around AG Grid. All grid configurations are done through:
- `GridConfig` — overall grid settings (theme, selection, context, etc.)
- `GridColumnConfig[]` — column definitions (extends AG Grid `ColDef` with extras)
- Data is passed via signal-based `[rowData]` input

---

## 1. File Structure

Column definitions always live in `state-service/config.ts`:

```
src/app/components/rawmilk/<feature-name>/
├── state-service/
│   └── config.ts              ← GridColumnConfig[] + FieldConfig[] definitions
├── <feature-name>.component.ts
├── <feature-name>.component.html
├── <feature-name>.component.scss
└── <feature-name>.service.ts
```

---

## 2. Required Imports

```typescript
// Component file
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';

// Config file
import {
  ActionCellRendererComponent,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';
```

---

## 3. Template Pattern

### Basic Grid

```html
<app-advanced-grid
  [rowData]="tableData()"
  [config]="gridConfig()"
></app-advanced-grid>
```

### Grid with Events

```html
<app-advanced-grid
  [rowData]="tableData()"
  [config]="gridConfig()"
  (selectionChanged)="handleSelectionChange($event)"
  (gridReady)="onGridReady($event)"
  (cellClicked)="onCellClicked($event)"
></app-advanced-grid>
```

### Grid with Slot Content (e.g., toolbar buttons)

```html
<app-advanced-grid [rowData]="data()" [config]="config()">
  <div class="header h-5 w-5 cursor-pointer" slot="right">
    <i class="fa-solid fa-circle-xmark icon-delete" (click)="deleteSelected()"></i>
  </div>
</app-advanced-grid>
```

---

## 4. GridConfig Signal Definition

### Basic Config

```typescript
gridConfig = signal<GridConfig>({
  theme: 'alpine',
  columns: myGridColumns,
});
```

### Config with Row Selection

```typescript
gridConfig = signal<GridConfig>({
  theme: 'alpine',
  rowSelectionMode: 'multiple',
  enableRowSelection: true,
  context: {
    componentParent: this,    // ← CRITICAL for cellRenderer callbacks
  },
  columns: myGridColumns,
});
```

### Config with Selective Row Selection

```typescript
gridConfig = signal<GridConfig>({
  theme: 'alpine',
  rowSelectionMode: 'multiple',
  enableRowSelection: true,
  isRowSelectable: (params: any) => {
    return params?.closeStatus == 1 && this.usertype() === 'Manager';
  },
  context: {
    componentParent: this,
  },
  columns: [],  // set dynamically in setupGrid()
});
```

### Updating Columns Dynamically

```typescript
setupGrid() {
  this.gridConfig.update((config) => ({
    ...config,
    columns: this.usertype() === 'Manager'
      ? [...viewColumns, actionColumn]
      : viewColumns,
  }));
}
```

---

## 5. GridConfig Interface — Key Properties

| Property                    | Type                                          | Default     | Description                        |
|-----------------------------|-----------------------------------------------|-------------|------------------------------------|
| `columns`                   | `GridColumnConfig[]`                          | **required**| Column definitions                 |
| `theme`                     | `'alpine' \| 'balham' \| 'material'`          | `'alpine'`  | AG Grid theme                      |
| `pagination`                | `boolean`                                     | `true`      | Enable pagination                  |
| `paginationPageSize`        | `number`                                      | `10`        | Rows per page                      |
| `paginationPageSizeSelector`| `number[]`                                    | `[10,20,50,100]` | Page size options             |
| `rowSelectionMode`          | `'single' \| 'multiple'`                      |             | Row selection mode                 |
| `enableRowSelection`        | `boolean`                                     |             | Enable checkbox selection          |
| `isRowSelectable`           | `(rowNode) => boolean`                        |             | Conditional row selectability      |
| `context`                   | `{ componentParent: this }`                   |             | **Required** for cell click callbacks |
| `enableSorting`             | `boolean`                                     | `true`      | Column sorting                     |
| `enableFiltering`           | `boolean`                                     | `true`      | Column filtering                   |
| `enableExport`              | `boolean`                                     | `true`      | Show export buttons                |
| `enableSearch`              | `boolean`                                     | `true`      | Show search bar                    |
| `height`                    | `string`                                      | `'500px'`   | Grid height                        |
| `autoHeight`                | `boolean`                                     | `false`     | Auto-size height to content        |
| `rowHeight`                 | `number`                                      | `38`        | Height of each row                 |
| `headerHeight`              | `number`                                      | `40`        | Height of header row               |
| `getRowStyle`               | `(params) => RowStyle`                        |             | Dynamic row styling                |
| `isRowPinned`               | `IsRowPinned<any>`                            |             | Pin rows to top/bottom             |
| `pinnedBottomRowData`       | `any[]`                                       |             | Data for pinned bottom rows        |
| `Title`                     | `string`                                      |             | Excel export title                 |
| `excelTitle`                | `string`                                      |             | Excel tab title                    |
| `pdfTitle`                  | `string`                                      |             | PDF document title                 |
| `customCssClass`            | `string`                                      |             | Extra CSS class on grid wrapper    |
| `selectionColumnDef`        | `ColDef`                                      |             | Custom selection column settings   |

---

## 6. Defining GridColumnConfig[] in `state-service/config.ts`

### Simple Field Mapping

```typescript
export const myGridColumns: GridColumnConfig[] = [
  {
    headerName: 'S.No.',
    field: 'serialNo',
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 100,
  },
  {
    headerName: 'Plant',
    field: 'plant_name',
  },
  {
    headerName: 'Quantity',
    field: 'quantity',
  },
];
```

### Nested Data with valueGetter

```typescript
{
  headerName: 'Date',
  valueGetter: (params: any) => {
    return params.data?.MilkDispatchDetails?.Date;
  },
},
```

### Column Groups (children)

```typescript
{
  headerName: 'Milk Dispatch Details',
  children: [
    {
      headerName: 'Qty.',
      valueGetter: (params: any) => params.data?.MilkDispatchDetails?.Qty,
    },
    {
      headerName: 'FAT%',
      valueGetter: (params: any) => params.data?.MilkDispatchDetails?.Fat,
    },
  ],
},
```

### Combined Value Display

```typescript
{
  headerName: 'Driver Details',
  valueGetter: (params: any) => {
    const name = params.data?.DriverName || '';
    const number = params.data?.DriverNumber || '';
    return name && number ? `${name} - ${number}` : name || number;
  },
},
```

### Hidden Column

```typescript
{
  headerName: 'Plant',
  hide: true,
},
```

---

## 7. Action Column with ActionCellRendererComponent

Define the action column separately for reusability:

```typescript
import { ActionCellRendererComponent, GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { colors } from '../../../../shared/utils/constants';

export const actionColumn: GridColumnConfig = {
  headerName: 'Action',
  field: 'action',
  cellRenderer: ActionCellRendererComponent,
  cellRendererParams: {
    actions: [
      {
        icon: 'fa-solid fa-pen-to-square',
        tooltip: 'Edit',
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onEdit(data);
          }
        },
        iconStyle: { color: colors.primary, cursor: 'pointer' },
      },
      {
        icon: 'fa fa-eye',
        tooltip: 'View',
        visible: (data: any) => data?.action_type == 3,  // conditional visibility
        onClick: (data: any, node: any, params: any) => {
          if (params.context?.componentParent) {
            params.context.componentParent.onView(data.id);
          }
        },
        iconStyle: {
          color: 'grey',
          cursor: 'pointer',
          fontSize: '18px',
          marginRight: '10px',
        },
      },
    ],
  },
};
```

### ActionConfig Interface

| Property      | Type                                          | Description                               |
|---------------|-----------------------------------------------|-------------------------------------------|
| `icon`        | `string`                                      | Font Awesome icon class or image path     |
| `isImg`       | `boolean`                                     | Set `true` if `icon` is an image URL      |
| `label`       | `string \| (data) => string`                  | Button text (static or dynamic)           |
| `tooltip`     | `string`                                      | Hover tooltip                             |
| `cssClass`    | `string`                                      | Custom CSS class                          |
| `buttonStyle` | `string`                                      | Inline button styles                      |
| `iconStyle`   | `object`                                      | Inline icon styles                        |
| `visible`     | `(data) => boolean`                           | Show/hide action conditionally            |
| `disabled`    | `(data) => boolean`                           | Disable action conditionally              |
| `onClick`     | `(data, node?, params?) => void`              | Click handler. Access parent via `params.context.componentParent` |

---

## 8. Data Signal & API Pattern

```typescript
tableData = signal<any[]>([]);
token = localStorage.getItem('AccessToken') || '';

getTableData(filterData?: any) {
  const payload = createFormData(this.token, {
    FromDate: filterData?.from || new Date().toISOString().split('T')[0],
    ToDate: filterData?.to || new Date().toISOString().split('T')[0],
    ForWeb: '1',
  });

  this.myService.getTableData(payload).subscribe({
    next: (res: any) => {
      if (res.Status === 'success') {
        this.tableData.set(res.Data || []);
        if (res.Data?.length === 0) {
          this.toastService.info(res.Message || 'No data found');
        }
      } else {
        this.tableData.set([]);
        this.toastService.error(res.Message || 'Error fetching data');
      }
    },
    error: (error: any) => {
      this.toastService.error(error.message || 'Error fetching data');
    },
  });
}
```

---

## 9. Row Data Input

The `AdvancedGridComponent` accepts row data as a **signal input**:

```typescript
// In component
rowData = input<any[]>([]);
```

Always bind with signal value:

```html
[rowData]="tableData()"
```

---

## 10. Checklist for New AG Grid Tables

- [ ] Create `GridColumnConfig[]` in `state-service/config.ts`
- [ ] Define `GridConfig` signal with at least `{ theme: 'alpine', columns: ... }`
- [ ] Set `context: { componentParent: this }` if using cellRenderer callbacks
- [ ] Define `signal<any[]>([])` for row data
- [ ] Add `AdvancedGridComponent` to component `imports`
- [ ] Use `[rowData]="data()"` (signal call) and `[config]="config()"`
- [ ] For action columns, export `actionColumn` separately using `ActionCellRendererComponent`
- [ ] Always access parent component via `params.context.componentParent`
