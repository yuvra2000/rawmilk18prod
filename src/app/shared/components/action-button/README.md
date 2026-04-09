# Action Button Component Usage Examples

## Basic Usage

```html
<!-- Simple button with default settings -->
<app-action-button name="Click Me" (buttonClick)="handleClick($event)" />

<!-- Button with custom color and icon -->
<app-action-button name="Save" color="success" icon="💾" actionType="save-data" [data]="{ id: 123 }" (buttonClick)="handleSave($event)" />
```

## Franchise Mapping Example

```html
<!-- Assign Franchise Button -->
<app-action-button name="Assign Franchise" color="primary" icon="+" actionType="assign-franchise" [data]="{ selectedRows: store.selectedRows() }" (buttonClick)="handleButtonAction($event)" />

<!-- Assign Button -->
<app-action-button name="Assign" color="success" icon="✓" actionType="assign" [data]="{ selectedRows: store.selectedRows() }" (buttonClick)="handleButtonAction($event)" />

<!-- De-assign Button -->
<app-action-button name="De-assign" color="danger" icon="⊗" actionType="de-assign" [data]="{ selectedRows: store.selectedRows() }" (buttonClick)="handleButtonAction($event)" />
```

## Custom Colors

```html
<!-- Using predefined color variants -->
<app-action-button name="Primary" color="primary" />
<app-action-button name="Success" color="success" />
<app-action-button name="Danger" color="danger" />
<app-action-button name="Warning" color="warning" />
<app-action-button name="Info" color="info" />

<!-- Using custom hex colors -->
<app-action-button name="Custom" color="#9c27b0" />
<app-action-button name="Brand" color="#ff5722" />
```

## With Icons

```html
<!-- FontAwesome icons -->
<app-action-button 
  name="Add" 
  [icon]="{ type: 'fa', value: 'fa-plus' }"
/>
<app-action-button 
  name="Delete" 
  [icon]="{ type: 'fa', value: 'fa-trash' }"
/>
<app-action-button 
  name="Edit" 
  [icon]="{ type: 'fa', value: 'fa-edit' }"
/>
<app-action-button 
  name="Download" 
  [icon]="{ type: 'fa', value: 'fa-download' }"
/>

<!-- Image icons -->
<app-action-button 
  name="Custom Action" 
  [icon]="{ type: 'img', value: '/assets/icons/custom.png', alt: 'Custom icon' }"
/>

<!-- Text/Unicode icons (backward compatible) -->
<app-action-button name="Add" icon="+" />
<app-action-button name="Check" icon="✓" />
<app-action-button name="Cross" icon="⊗" />
```

## Disabled State

```html
<app-action-button name="Disabled Button" [disabled]="true" color="secondary" />

<!-- Conditional disabled state -->
<app-action-button name="Submit" [disabled]="!formValid()" color="primary" />
```

## Component Handler

```typescript
export class YourComponent {
  handleButtonAction(actionData: ActionButtonData): void {
    switch (actionData.action) {
      case "assign-franchise":
        this.assignFranchise(actionData.data);
        break;
      case "assign":
        this.assign(actionData.data);
        break;
      case "de-assign":
        this.deAssign(actionData.data);
        break;
      default:
        console.warn("Unhandled action:", actionData.action);
    }
  }

  private assignFranchise(data: any): void {
    // Your logic here
    console.log("Processing assign franchise:", data);
  }
}
```

## Input Properties

| Property     | Type      | Default     | Description                   |
| ------------ | --------- | ----------- | ----------------------------- |
| `name`       | `string`  | required    | Button text content           |
| `color`      | `string`  | `'primary'` | Color variant or hex color    |
| `icon`       | `string`  | `''`        | Icon to display before text   |
| `disabled`   | `boolean` | `false`     | Whether button is disabled    |
| `actionType` | `string`  | `''`        | Custom action identifier      |
| `data`       | `any`     | `null`      | Data to pass with click event |

## Output Events

| Event         | Type               | Description                    |
| ------------- | ------------------ | ------------------------------ |
| `buttonClick` | `ActionButtonData` | Emitted when button is clicked |

## ActionButtonData Interface

```typescript
interface ActionButtonData {
  action: string; // Action type or derived from name
  data?: any; // Data passed to the button
}
```

## Icon Configuration

The `icon` property accepts either:
- **String**: Simple text/unicode icon (backward compatible)
- **IconConfig**: Object for FontAwesome or image icons

### IconConfig Interface

```typescript
interface IconConfig {
  type: 'fa' | 'img' | 'text';
  value: string;
  alt?: string; // Optional, for img type
}
```

### Icon Type Examples

```typescript
// FontAwesome icon
{ type: 'fa', value: 'fa-plus' }

// Image icon
{ type: 'img', value: '/path/to/icon.png', alt: 'Description' }

// Text icon (same as passing string directly)
{ type: 'text', value: '+' }

// String shorthand (converted to text type)
icon="+"
```
