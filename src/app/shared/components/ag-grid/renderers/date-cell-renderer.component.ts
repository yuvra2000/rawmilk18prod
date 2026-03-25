import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams,ICellEditorParams } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { StatusCellRendererComponent } from './status-cell-renderer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-cell-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input 
      type="date"
      class="cell-date-input"
      [(ngModel)]="dateValue"
      (change)="onChange()"
      #dateInput
    />
  `,
  styles: [`
    .cell-date-input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      font-size: 14px;
      padding: 0 8px;
    }

    .cell-date-input:focus {
      box-shadow: 0 0 0 2px #007bff;
    }
  `]
})
export class DateCellEditorComponent implements ICellEditorAngularComp {
  params!: ICellEditorParams;
  dateValue = '';

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.dateValue = params.value ? 
      new Date(params.value).toISOString().split('T')[0] : '';
  }

  getValue(): any {
    return this.dateValue ? new Date(this.dateValue) : null;
  }

  onChange(): void {
    this.params.stopEditing();
  }
}

// Export all components
export const CELL_RENDERERS = {
  actionCellRenderer: ActionCellRendererComponent,
  statusCellRenderer: StatusCellRendererComponent,
//   progressCellRenderer: ProgressCellRendererComponent,
//   imageCellRenderer: ImageCellRendererComponent
};

export const CELL_EDITORS = {
//   selectCellEditor: SelectCellEditorComponent,
  dateCellEditor: DateCellEditorComponent
};