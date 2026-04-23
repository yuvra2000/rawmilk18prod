import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './grid-table.component.html',
  styleUrl: './grid-table.component.scss'
})
export class GridTableComponent {

  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
@Input() isTracking: boolean = false;
  @Output() selectionChange = new EventEmitter<any[]>();

  gridApi!: GridApi;

  gridOptions: GridOptions = {
    rowSelection: {
      mode: 'multiRow',
      checkboxes: true,
    }
  };

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

 onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;

  this.updateSelectionMode();

  setTimeout(() => {
    const allColumnIds: string[] = [];

    this.gridApi.getColumns()?.forEach((col) => {
      allColumnIds.push(col.getId());
    });

    this.gridApi.autoSizeColumns(allColumnIds);
  }, 200);
}

// 🔥 ADD THIS
ngOnChanges() {
  if (this.gridApi) {
    this.updateSelectionMode();
  }
}

// 🔥 MAIN LOGIC
updateSelectionMode() {
  if (!this.gridApi) return;

  if (this.isTracking) {
    // ✅ MULTI SELECT
    this.gridApi.setGridOption('rowSelection', {
      mode: 'multiRow',
      checkboxes: true
    });
  } else {
    // ❌ SINGLE SELECT
    this.gridApi.setGridOption('rowSelection', {
      mode: 'singleRow',
      checkboxes: true
    });
  }

  this.gridApi.deselectAll();
}

  onSelectionChanged() {
    const selected = this.gridApi.getSelectedRows();
    this.selectionChange.emit(selected);
  }
}