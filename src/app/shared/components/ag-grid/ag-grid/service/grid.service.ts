import { ColDef, GridOptions, RowSelectedEvent, CellClickedEvent, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';

/** The main configuration object for the AdvancedAgGridComponent. */
export interface GridConfig {
  /** An observable of the data to be displayed in the grid. */
  rowData$: Observable<any[]>;

  /** The column definitions for the grid. */
  columnDefs: ColDef[];

  /** A unique ID for the grid, used for features like saving state. */
  gridId?: string;
  
  /** High-level feature flags for the custom toolbar and panels. */
  features?: {
    enableSearch?: boolean;
    enableExport?: boolean;
    // Let AG Grid's built-in side bar handle this.
    // enableColumnVisibility?: boolean; 
  };

  /** Any native AG Grid GridOptions can be passed here to override defaults. */
  customGridOptions?: GridOptions;
}

/** Defines the state of the grid that can be saved and restored. */
export interface GridState {
  columnState: any[];
  filterState: any;
}