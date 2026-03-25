import { ColDef, GridOptions, RowSelectedEvent, CellClickedEvent, GridReadyEvent, RowDoubleClickedEvent, FilterChangedEvent, SortChangedEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';

/** The main configuration object for the AdvancedAgGridComponent. */
export interface GridConfig {
  /** An observable of the data to be displayed in the grid. */
  rowData$: Observable<any[]>;

  /** The column definitions for the grid. */
  columnDefs: ColDef[];

  /** Any native AG Grid GridOptions to override the component's defaults. */
  gridOptions?: GridOptions;

  /** A unique ID for the grid, used for features like saving state. */
  gridId?: string;
   height?: string;
  /** High-level feature flags for the custom toolbar and panels. */
  features?: {
    showToolbar?: boolean;
    enableSearch?: boolean;
    enableExport?: boolean;
  };
}

/** Defines the state of the grid that can be saved and restored. */
export interface GridState {
  columnState: any[];
  filterState: any;
}

/** Defines all possible events emitted by the grid. */
export interface GridEvents {
  onGridReady: GridReadyEvent;
  onSelectionChanged: any[];
  onCellClicked: CellClickedEvent;
  onRowDoubleClicked: RowDoubleClickedEvent;
  onFilterChanged: FilterChangedEvent;
  onSortChanged: SortChangedEvent;
}