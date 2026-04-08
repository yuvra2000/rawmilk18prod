import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
  TemplateRef,
  ContentChild,
  signal,
  computed,
  input,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule, ICellRendererAngularComp } from 'ag-grid-angular';

import {
  GridApi,
  GridReadyEvent,
  ColDef,
  GridOptions,
  RowSelectedEvent,
  CellClickedEvent,
  FilterChangedEvent,
  SortChangedEvent,
  ColumnResizedEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent,
  PaginationChangedEvent,
  // ColumnApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  GetRowIdParams,
  CellValueChangedEvent,
  RowEditingStoppedEvent,
  NewValueParams,
  // ValueFormatterParams,
  // ValueGetterParams,
  ICellRendererParams,
  // GetContextMenuItemsParams,
  // DefaultMenuItem,
  // MenuItemDef,
  RowStyle,
  themeAlpine,
  // themeBalham,
  // themeMaterial,
  // themeQuartz,
  // ModuleRegistry,
  IRowNode,
  IsRowPinned,
  RowSelectionOptions,
  TextDataTypeDefinition,
  DataTypeDefinition,
  // ICellRendererAngularComp
} from 'ag-grid-community';
// import { MenuModule } from '@ag-grid-enterprise/menu';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  config,
} from 'rxjs';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
// import { FleetCellRendererComponent } from '../../../../cv/common/manage/route-fleet-assignment/clickable-chips-renderer';
import {
  ExcelExportOptions,
  ExcelExportService,
  ExcelStyleOptions,
} from './service/excel.service';
import { PdfExportOptions, PdfExportService } from './service/pdf.service';
// Interfaces for type safety
export interface GridColumnConfig extends ColDef {
  exportable?: boolean;
  searchable?: boolean;
  customRenderer?: string;
  customEditor?: string;
  validation?: (value: any) => boolean | string;
  children?: GridColumnConfig[];
}

export interface GridConfig {
  columns: GridColumnConfig[];
  data?: any[];
  serverSideMode?: boolean;
  isRowSelectable?: (rowNode: any) => boolean;
  getRowStyle?: (params: any) => RowStyle | undefined;
  serverSideDataSource?: (params: IServerSideGetRowsParams) => Promise<any>;
  isRowPinned?: IsRowPinned<any>;
  pinnedBottomRowData?: any[];
  pagination?: boolean;
  paginationPageSize?: number;
  paginationPageSizeSelector?: number[];
  enableSorting?: boolean;
  enableRowPinning?: boolean;
  enableFiltering?: boolean;
  enableFloatingFilter?: boolean;
  enableColumnReordering?: boolean;
  enableColumnResizing?: boolean;
  rowSelection?:
    | RowSelectionOptions<TextDataTypeDefinition>
    | 'single'
    | 'multiple';
  enableRowSelection?: boolean;
  rowSelectionMode?: 'single' | 'multiple';
  enableCellEditing?: boolean;
  enableExport?: boolean;
  enableSearch?: boolean;
  theme?: 'alpine' | 'balham' | 'material' | 'bootstrap';
  height?: string;
  autoHeight?: boolean;
  width?: string;
  showLoadingOverlay?: boolean;
  showNoRowsOverlay?: boolean;
  customCssClass?: string;
  rowHeight?: number;
  headerHeight?: number;
  enableRowGrouping?: boolean;
  enableColumnPinning?: boolean;
  enableRangeSelection?: boolean;
  enableClipboard?: boolean;
  enableUndoRedoEdit?: boolean;
  // customContextMenu?: boolean;
  autoSizeColumns?: boolean;
  fitColumnsOnGridReady?: boolean;
  preserveScrollPosition?: boolean;
  enableTreeData?: boolean;
  treeDataChildrenField?: string;
  enableMasterDetail?: boolean;
  isRowMaster?: (dataItem: any) => boolean;
  detailCellRenderer?: string;
  detailCellRendererParams?: any;
  excelTitle?: string;
  Title?: string;
  pdfTitle?: string;
  selectionColumnDef?: ColDef;
  // enableStatusBar?: boolean;
  initialState?: any;
  // enableSideBar?: boolean;
  tooltipComponent?: any;
  context?: any;
  isFitGridWidth?: boolean;
}

export interface GridEvents {
  onRowSelected?: (event: RowSelectedEvent) => void;
  onCellClicked?: (event: CellClickedEvent) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void;
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  onFilterChanged?: (event: FilterChangedEvent) => void;
  onSortChanged?: (event: SortChangedEvent) => void;
  onColumnResized?: (event: ColumnResizedEvent) => void;
  onPaginationChanged?: (event: PaginationChangedEvent) => void;
  onCellValueChanged?: (event: CellValueChangedEvent) => void;
  onRowEditingStopped?: (event: RowEditingStoppedEvent) => void;
}

export interface SearchConfig {
  enabled: boolean;
  placeholder?: string;
  debounceTime?: number;
  searchFields?: string[];
  caseSensitive?: boolean;
}

export interface ExportConfig {
  enableCsvExport?: boolean;
  enableExcelExport?: boolean;
  csvFileName?: string;
  excelFileName?: string;
  includeHeaders?: boolean;
  onlySelected?: boolean;
  customExportParams?: any;
}

export interface IActionCellRendererParams extends ICellRendererParams {
  actions: ActionConfig[];
  showWhen?: (data: any) => boolean;
  cellStyle?: string;
}

// ✅ Internal Interfaces for clarity
export interface ActionConfig {
  icon?: string;
  isImg?: boolean;
  iconStyle?: string;
  label?: string | ((data: any) => string); // Supports static string OR dynamic function
  tooltip?: string;
  cssClass?: string;
  buttonStyle?: string;
  visible?: (data: any) => boolean;
  disabled?: (data: any) => boolean;
  onClick?: (data: any, node?: any, params?: any) => void;
  onHover?: (data: any, node?: any, params?: any) => void;
  labelStyle?: { [key: string]: string }; // New property for label styling
}

export interface IActionCellRendererParams extends ICellRendererParams {
  actions: ActionConfig[];
  showWhen?: (data: any) => boolean;
  cellStyle?: string;
}

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule, NgbTooltip],
  template: `
    @if (shouldShow()) {
      <div class="action-cell" [style]="cellStyle()">
        @for (action of visibleActions(); track $index) {
          <button
            [class]="action.cssClass || 'btn'"
            [disabled]="action.disabled && action.disabled(rowData())"
            (click)="onActionClick(action)"
            [ngbTooltip]="action.tooltip"
            container="body"
            type="button"
            [style]="action.buttonStyle"
            (mouseenter)="onActionHover(action)"
          >
            @if (action.icon && isIconVisible(action)) {
              @if (action.isImg) {
                <img
                  [src]="action.icon"
                  [style]="action.iconStyle"
                  alt="icon"
                  class="action-icon"
                />
              } @else {
                <i [class]="action.icon" [style]="action.iconStyle"></i>
              }
            }

            @if (action.label) {
              <span
                [style]="
                  action?.labelStyle
                    ? action.labelStyle
                    : { 'margin-left': '5px' }
                "
              >
                {{ getActionLabel(action) }}
              </span>
            }
          </button>
        }
      </div>
    }
  `,
  styles: [
    `
      .action-cell {
        display: flex;
        gap: 4px;
        align-items: center;
        height: 100%;
        justify-content: center;
      }
      .btn {
        padding: 2px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        background: transparent;
        transition: opacity 0.2s;
      }
      .btn:hover {
        opacity: 0.7;
      }
      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .action-icon {
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
    `,
  ],
})
export class ActionCellRendererComponent
  implements ICellRendererAngularComp, OnDestroy
{
  private params = signal<IActionCellRendererParams | null>(null);

  readonly rowData = computed(() => this.params()?.data);
  readonly actions = computed(() => this.params()?.actions || []);
  readonly cellStyle = computed(() => this.params()?.cellStyle);
  // Filter actions based on 'visible' function
  readonly visibleActions = computed(() => {
    const data = this.rowData();
    return this.actions().filter((action) =>
      action.visible ? action.visible(data) : true,
    );
  });

  // Show/Hide whole cell based on 'showWhen'
  readonly shouldShow = computed(() => {
    const showWhenFn = this.params()?.showWhen;
    return showWhenFn ? showWhenFn(this.rowData()) : true;
  });

  agInit(params: IActionCellRendererParams): void {
    this.params.set(params);
  }

  refresh(params: IActionCellRendererParams): boolean {
    this.params.set(params);
    return true;
  }
  ngOnDestroy(): void {
    // Release references immediately
    this.params.set(null);
  }

  // ✅ Key Logic: Handles both String and Function labels
  getActionLabel(action: ActionConfig): string {
    if (typeof action.label === 'function') {
      return action.label(this.rowData());
    }
    return action.label || '';
  }
  isIconVisible(action: any): boolean {
    if (action.iconVisible) {
      return action.iconVisible(this.rowData());
    }
    return true; // Default: show icon if property not provided
  }

  onActionClick(action: ActionConfig): void {
    if (action.onClick) {
      action.onClick(this.rowData(), this.params()?.node, this.params());
    }
  }
  onActionHover(action: ActionConfig): void {
    if (action.onHover) {
      action.onHover(this.rowData(), this.params()?.node, this.params());
    }
  }
}

// export class ActionCellRendererComponent implements ICellRendererAngularComp {
//   private params = signal<IActionCellRendererParams | null>(null);

//   readonly actions = computed(() => this.params()?.actions || []);
//   readonly rowData = computed(() => this.params()?.data);

//   readonly visibleActions = computed(() => {
//     const data = this.rowData();
//     return this.actions().filter((action) =>
//       action.visible ? action.visible(data) : true
//     );
//   });

//   readonly shouldShow = computed(() => {
//     const showWhenFn = this.params()?.showWhen;
//     return showWhenFn ? showWhenFn(this.rowData()) : true;
//   });

//   agInit(params: IActionCellRendererParams): void {
//     this.params.set(params);
//   }

//   refresh(params: IActionCellRendererParams): boolean {
//     this.params.set(params);
//     return true;
//   }

//   onActionClick(action: ActionConfig): void {
//     if (action.onClick) {
//       action.onClick(this.rowData(), this.params()?.node);
//     }
//   }
// }
@Component({
  selector: 'app-status-cell-renderer',
  template: `
    <span [class]="'status-badge status-' + getStatus()" [title]="params.value">
      {{ params.value }}
    </span>
  `,
  styles: [
    `
      .status-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
      }
      .status-active {
        background: #d4edda;
        color: #155724;
      }
      .status-inactive {
        background: #f8d7da;
        color: #721c24;
      }
      .status-pending {
        background: #fff3cd;
        color: #856404;
      }
      .status-completed {
        background: #d1ecf1;
        color: #0c5460;
      }
    `,
  ],
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  getStatus(): string {
    const statusFromParams = this.params?.colDef?.cellRendererParams?.status;

    if (typeof statusFromParams === 'function') {
      return statusFromParams(this.params);
    }

    if (typeof statusFromParams === 'string') {
      return statusFromParams.toLowerCase();
    }

    return this.params.value?.toLowerCase() || 'inactive';
  }
}

@Component({
  selector: 'app-advanced-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgbTooltip],
  template: `
    <div class="advanced-grid-container" [ngStyle]="containerStyles">
      <!-- Toolbar -->
      <div
        class="grid-toolbar"
        *ngIf="showToolbar"
        style="justify-content: space-between;"
      >
        <div style=" gap: 7px;display: flex;">
          <ng-content select="[slot=left]"></ng-content>
          <ng-content></ng-content>
        </div>
        <!-- Search -->
        <div class="tbl-button">
          <ng-content select="[slot=right]"></ng-content>
          <div class="search-container">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              [(ngModel)]="searchTerm"
              (input)="onSearchInput($event)"
              style="padding: 3px 12px;"
            />
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </div>

          <!-- Action Buttons -->
          <div class="toolbar-actions">
            <button
              *ngIf="
                config().enableExport !== false && exportConfig.enableCsvExport
              "
              class="toolbar-btn"
              (click)="exportToCsv()"
              ngbTooltip="Export CSV"
            >
              <!-- <i class="fas fa-file-csv"></i> -->
              <img src="assets/grid-icon/csv.svg" class="tbl-icon" />
            </button>

            <button
              *ngIf="
                config().enableExport !== false &&
                exportConfig.enableExcelExport
              "
              class="toolbar-btn"
              (click)="exportToExcel()"
              ngbTooltip="Export Excel"
            >
              <!-- <i class="fas fa-file-excel"></i> -->
              <img src="assets/grid-icon/excel.svg" class="tbl-icon" />
            </button>
            <!-- 
          <button
            class="toolbar-btn"
            (click)="refreshGrid()"
            ngbTooltip="Refresh Data"
          >
  
           <img src='assets/grid-icon/pdf_dock.svg' class="tbl-icon">
          </button> -->

            <!-- PDF Export Dropdown (NEW) -->
            <!-- <div class="btn-group" dropdown>
      <button 
        type="button" 
        class="btn btn-outline-danger btn-sm"
        (click)="exportToPdf()"
        [disabled]="!gridApi || isPdfExporting()"
        title="Export to PDF">
        <i class="fas fa-file-pdf"></i> 
        <span *ngIf="!isPdfExporting()">PDF</span>
        <span *ngIf="isPdfExporting()">
          <i class="fas fa-spinner fa-spin"></i> {{ pdfExportProgress().progress }}%
        </span>
      </button>

      <button 
        type="button" 
        class="btn btn-outline-danger btn-sm dropdown-toggle dropdown-toggle-split"
        dropdownToggle
        [disabled]="!gridApi || isPdfExporting()"
        aria-haspopup="true" 
        aria-expanded="false">
        <span class="sr-only">Toggle Dropdown</span>
      </button>

      <ul class="dropdown-menu" *dropdownMenu>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            (click)="exportToPdf(); $event.preventDefault()">
            <i class="fas fa-file-pdf me-2"></i>Standard PDF
          </a>
        </li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            (click)="exportSelectedToPdf(); $event.preventDefault()">
            <i class="fas fa-check-square me-2"></i>Selected Rows Only
          </a>
        </li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            (click)="exportStyledPdf(); $event.preventDefault()">
            <i class="fas fa-palette me-2"></i>Styled PDF
          </a>
        </li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            (click)="exportPdfWithPreview(); $event.preventDefault()">
            <i class="fas fa-eye me-2"></i>Preview PDF
          </a>
        </li>
      </ul>
    </div> -->

            <!-- Progress indicator for PDF export -->
            <!-- <div 
    class="export-progress mt-2" 
    *ngIf="isPdfExporting()">
    <div class="progress" style="height: 4px;">
      <div 
        class="progress-bar bg-danger" 
        role="progressbar" 
        [style.width.%]="pdfExportProgress().progress"
        [attr.aria-valuenow]="pdfExportProgress().progress"
        aria-valuemin="0" 
        aria-valuemax="100">
      </div>
    </div>
    <small class="text-muted">{{ pdfExportProgress().message }}</small>
  </div> -->

            <button
              *ngIf="config().enableColumnReordering"
              class="toolbar-btn"
              (click)="resetColumns()"
              ngbTooltip="Reset Columns"
            >
              <i class="fas fa-undo"></i>
            </button>

            <button
              *ngIf="config().autoSizeColumns"
              class="toolbar-btn"
              (click)="autoSizeAllColumns()"
              ngbTooltip="Auto-Size Columns"
            >
              <i class="fas fa-arrows-alt-h"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Loading Overlay 
      <div class="loading-overlay" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>-->

      <!-- AG-Grid -->
      <div class="grid-wrapper w-100 " [ngClass]="config().customCssClass">
        <ag-grid-angular
          #agGrid
          [class]="getThemeClass()"
          [dataTypeDefinitions]="dataTypeDefinitions"
          [theme]="theme"
          [style.height]="
            config().autoHeight ? undefined : config().height || '500px'
          "
          [loading]="loadingComputed()"
          [style.width]="config().width || '100%'"
          [rowData]="this.rowData()"
          [columnDefs]="processedColumnDefs()"
          [gridOptions]="gridOptions()"
          [defaultColDef]="defaultColDef()"
          [serverSideDatasource]="serverSideDatasource"
          [rowModelType]="config().serverSideMode ? 'serverSide' : 'clientSide'"
          [pagination]="config().pagination !== false"
          [paginationPageSize]="config().paginationPageSize || 10"
          [paginationPageSizeSelector]="
            config().paginationPageSizeSelector || [10, 20, 50, 100]
          "
          [cellSelection]="config().enableRangeSelection || false"
          [rowHeight]="config().rowHeight || 38"
          [headerHeight]="config().headerHeight || 40"
          [getRowId]="getRowId"
          [isExternalFilterPresent]="isExternalFilterPresent"
          [doesExternalFilterPass]="doesExternalFilterPass"
          [treeData]="config().enableTreeData || false"
          [getDataPath]="getDataPath"
          [groupDefaultExpanded]="groupDefaultExpanded"
          [masterDetail]="config().enableMasterDetail || false"
          [isRowMaster]="config().isRowMaster"
          [detailCellRenderer]="config().detailCellRenderer"
          [detailCellRendererParams]="config().detailCellRendererParams"
          [undoRedoCellEditing]="config().enableUndoRedoEdit || false"
          [enableCellTextSelection]="true"
          [scrollbarWidth]="15"
          [alwaysShowHorizontalScroll]="true"
          [suppressMenuHide]="false"
          (gridReady)="onGridReady($event)"
          (rowSelected)="onRowSelected($event)"
          (selectionChanged)="onSelectionChanged($event)"
          (cellClicked)="onCellClicked($event)"
          (rowDoubleClicked)="onRowDoubleClicked($event)"
          (filterChanged)="onFilterChanged($event)"
          (sortChanged)="onSortChanged($event)"
          (columnResized)="onColumnResized($event)"
          (paginationChanged)="onPaginationChanged($event)"
          (cellValueChanged)="onCellValueChanged($event)"
          (rowEditingStopped)="onRowEditingStopped($event)"
          [selectionColumnDef]="config().selectionColumnDef"
          [tooltipShowDelay]="500"
          [getRowStyle]="config().getRowStyle"
          [isRowPinned]="config().isRowPinned"
          [pinnedBottomRowData]="config().pinnedBottomRowData"
          [rowSelection]="config().rowSelection"
          [initialState]="config().initialState"
        >
        </ag-grid-angular>
      </div>

      <!-- Grid Info -->
      <div class="grid-info" *ngIf="showGridInfo">
        <span class="info-item">
          Total: {{ totalRows }} | Selected: {{ selectedRows.length }} |
          Filtered: {{ filteredRows }}
        </span>
      </div>
    </div>
  `,
  styleUrl: './ag-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedGridComponent implements OnInit, OnDestroy {
  setColumns(newColumns: GridColumnConfig[]) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('agGrid') agGrid!: any;
  @ContentChild('customTemplate') customTemplate!: TemplateRef<any>;

  // Input Properties
  // @Input() config: GridConfig = { columns: [] };
  // @Input() rowData!: any[];
  config = input.required<GridConfig>();
  rowData = input<any[]>([]);
  loadingRowData = input<boolean>(true);
  @Input() events: GridEvents = {};
  @Input() searchConfig: SearchConfig = { enabled: true };
  @Input() exportConfig: ExportConfig = {
    enableCsvExport: true,
    enableExcelExport: true,
  };
  // ..
  @Input() showToolbar: boolean = true;
  @Input() showGridInfo: boolean = false;
  @Input() loadingText: string = 'Loading...';

  // Output Events
  @Output() gridReady = new EventEmitter<GridApi>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() cellClicked = new EventEmitter<any>();
  @Output() rowDoubleClicked = new EventEmitter<any>();
  @Output() dataChanged = new EventEmitter<any[]>();
  @Output() filterChanged = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<any>();
  uniqueRowKey = input<string>('id');
  loadingSignal = signal(true);
  loadingComputed = computed(() => {
    return this.loadingSignal();
  });
  // Public Properties
  gridApi!: GridApi;
  // columnApi!: ColumnApi;
  // rowData: any[] = [];
  // processedColumnDefs: ColDef[] = [];
  selectedRows: any[] = [];
  totalRows: number = 0;
  filteredRows: number = 0;
  isLoading: boolean = true;
  searchTerm: string = '';

  // Private Properties
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private originalRowData: any[] = [];

  // Grid Configuration
  // gridOptions: GridOptions = {};
  // defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: true,
  //   resizable: true,
  //   floatingFilter: false,
  // };
  /**
   * Recursively maps a GridColumnConfig tree into AG-Grid ColDef / ColGroupDef nodes.
   * Group nodes (those with `children`) are treated as ColGroupDef:
   *  - leaf-only transforms (editable, validation, customRenderer, customEditor) are skipped
   *  - `field` is removed so AG-Grid doesn't confuse the group with a value column
   * Leaf nodes receive the full normalisation that existed before.
   */
  private mapColumn = (col: GridColumnConfig): ColDef => {
    const isGroup = Array.isArray(col.children) && col.children.length > 0;

    if (isGroup) {
      // ── Column Group ──────────────────────────────────────────────────────────
      // ColGroupDef props we care about; strip leaf-only keys to keep AG-Grid happy
      const {
        field: _field,
        customRenderer: _cr,
        customEditor: _ce,
        validation: _v,
        exportable: _ex,
        searchable: _se,
        filter: _f,
        floatingFilter: _ff,
        editable: _ed,
        valueSetter: _vs,
        cellRenderer: _cellR,
        cellEditor: _cellE,
        ...groupRest
      } = col as any;

      return {
        ...groupRest,
        // marryChildren keeps group header intact when columns are moved
        marryChildren: (col as any).marryChildren ?? true,
        children: col.children!.map(this.mapColumn),
      } as any;
    }

    // ── Leaf Column ─────────────────────────────────────────────────────────────
    const processedCol: ColDef = {
      ...col,
      sortable:
        this.config().enableSorting !== false ? col.sortable !== false : false,
      filter:
        this.config().enableFiltering !== false ? col.filter !== false : false,
      resizable:
        this.config().enableColumnResizing !== false
          ? col.resizable !== false
          : false,
      editable: this.config().enableCellEditing && col.editable,
      pinned: col.pinned || null,
      lockPosition: col.lockPosition || false,
      suppressMovable: !this.config().enableColumnReordering,
    };

    // Custom cell renderer
    if (col.customRenderer) {
      processedCol.cellRenderer = col.customRenderer;
    }

    // Custom cell editor
    if (col.customEditor) {
      processedCol.cellEditor = col.customEditor;
    }

    // Validation wrapper around valueSetter
    if (col.validation && this.config().enableCellEditing) {
      const originalValueSetter = col.valueSetter;

      processedCol.valueSetter = (params: NewValueParams) => {
        const validationResult = col.validation!(params.newValue);
        if (validationResult !== true) {
          alert(
            typeof validationResult === 'string'
              ? validationResult
              : 'Invalid value',
          );
          return false;
        }
        if (typeof originalValueSetter === 'function') {
          return originalValueSetter(params);
        }
        return true;
      };
    }

    return processedCol;
  };

  processedColumnDefs = computed(() => {
    const currentConfig = this.config();
    if (!currentConfig.columns) return [];
    return currentConfig.columns.map(this.mapColumn);
  });

  defaultColDef = computed(() => {
    const currentConfig = this.config();
    return {
      sortable: currentConfig.enableSorting !== false,
      filter: currentConfig.enableFiltering !== false,
      resizable: currentConfig.enableColumnResizing !== false,
      floatingFilter: currentConfig.enableFloatingFilter ?? false,
      tooltipComponent: currentConfig.tooltipComponent,
      enableRowPinning: currentConfig.enableRowPinning !== false,
    };
  });
  gridOptions = computed(() => {
    const currentConfig = this.config();
    // console.log('Computing grid options with config:', currentConfig);
    const options: GridOptions = {
      context: currentConfig.context || {},
      domLayout: currentConfig.autoHeight ? 'autoHeight' : undefined,
      rowBuffer: 30,
      autoSizeStrategy: this.config().autoSizeColumns
        ? { type: 'fitCellContents' }
        : undefined,

      cellSelection: this.config().enableRangeSelection || false,
      rowHeight: this.config().rowHeight,
      headerHeight: this.config().headerHeight,
      enableCellTextSelection: true,
      suppressMenuHide: false,
      // suppressContextMenu: !this.config.customContextMenu,
      undoRedoCellEditing: this.config().enableUndoRedoEdit || false,
      treeData: this.config().enableTreeData || false,
      getDataPath: this.getDataPath.bind(this),
      masterDetail: this.config().enableMasterDetail || false,
      detailCellRenderer: this.config().detailCellRenderer,
      // ... all other grid options derived from `currentConfig` ...
      // isRowSelectable: currentConfig.isRowSelectable,
    };

    if (currentConfig.enableRowSelection) {
      if (this.config().enableRowSelection === true) {
        const selectionMode =
          this.config().rowSelectionMode === 'single'
            ? 'singleRow'
            : 'multiRow';

        options.rowSelection = {
          mode: selectionMode,
          enableClickSelection: false,
          checkboxes: true,
          isRowSelectable: (rowNode: IRowNode) => {
            if (currentConfig.isRowSelectable) {
              return currentConfig.isRowSelectable(rowNode.data);
            }
            return true; // Default: all rows selectable
          },
        };
      }
      //yeh place thodi doubtful hai
    }
    if (this.config().isFitGridWidth) {
      options.autoSizeStrategy = { type: 'fitGridWidth' };
    }
    console.log('Final grid options:', options);
    return options;
  });
  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
    statusCellRenderer: StatusCellRendererComponent,
    // fleetCellRenderer: FleetCellRendererComponent,
  };

  paginationPageSizeSelector = [10, 25, 50, 100, 200];
  groupDefaultExpanded = -1;
  public theme = themeAlpine;
  // Server-side datasource
  serverSideDatasource: IServerSideDatasource | undefined = undefined; // ✅ Correctly typed as undefined

  constructor(
    private excelExportService: ExcelExportService,
    private pdfExportService: PdfExportService, // Add this
  ) {
    effect(
      () => {
        this.loadingSignal.set(true);
        // console.log(this.rowData(), 'rowdata changed');
        if (
          (this.rowData() && this.rowData().length > 0) ||
          !this.loadingRowData()
        ) {
          this.loadingSignal.set(false);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSearch();
    // console.log(this.rowData);
  }

  public dataTypeDefinitions: { [key: string]: DataTypeDefinition } = {
    dateTimeString: {
      baseDataType: 'dateTimeString',
      extendsDataType: 'dateTimeString',

      // String -> Date (Internal logic same rahegi)
      dateParser: (value: string | undefined) => {
        if (!value) return undefined;
        return new Date(value.replace(' ', 'T'));
      },

      // Date -> String (Display logic same rahegi)
      dateFormatter: (value: Date | undefined | null) => {
        if (!value) return '';
        const pad = (n: number) => n.toString().padStart(2, '0');
        return (
          `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ` +
          `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
        );
      },
    },
  };
  // advanced-grid.component.ts

  ngOnDestroy(): void {
    // 1. Signal & Subject Cleanup
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();

    // 2. Safe Grid Disposal (v34+ Standards)
    if (this.gridApi) {
      const isAlive = !this.gridApi.isDestroyed();
      if (isAlive) {
        try {
          // 🔥 MAGIC: Clear closures by resetting options
          this.gridApi.setGridOption('columnDefs', []);
          this.gridApi.setGridOption('rowData', []);

          // Remove bound functions (fixes 'system/Context' leak)
          this.gridApi.setGridOption('getDataPath' as any, () => []);
          this.gridApi.setGridOption('getRowId' as any, () => '');

          this.gridApi.destroy();
        } catch (e) {
          // Silent catch for race conditions
        }
      }
      this.gridApi = null!; // Clear reference
    }

    // 3. Reset Class Properties (To break 'native_bind' and 'QueryList')
    this.agGrid = null; // ViewChild cleanup
    this.doesExternalFilterPass = () => true;
    this.isExternalFilterPresent = () => false;

    // 4. 🚨 THE MOST IMPORTANT STEP FOR SNAPSHOTS 🚨
    // '' leak ko khatam karne ke liye console saaf karein
    // console.clear();

    // Note: Turn OFF "Preserve Log" in Chrome Console settings
    console.log('🚀 Isolation Test: Component Purged Successfully');
  }

  private initializeComponent(): void {
    // this.processConfiguration();
    // this.setupRowData();
    this.setupServerSideDataSource();
  }

  private setupRowData(): void {
    if (this.config().data && !this.config().serverSideMode) {
      // this.rowData = [...this.config.data];
      this.originalRowData = this.rowData();
      this.totalRows = this.rowData().length;
      this.filteredRows = this.rowData().length;
    }
  }

  private setupServerSideDataSource(): void {
    if (this.config().serverSideMode && this.config().serverSideDataSource) {
      this.serverSideDatasource = {
        getRows: async (params: IServerSideGetRowsParams) => {
          try {
            this.isLoading = true;
            const result = await this.config().serverSideDataSource!(params);
            params.success({
              rowData: result.data || [],
              rowCount: result.totalCount || 0,
            });
          } catch (error) {
            // console.error('Server-side data fetch error:', error);
            params.fail();
          } finally {
            this.isLoading = false;
          }
        },
      };
    }
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.searchConfig.debounceTime || 300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((searchTerm) => {
        // this.performSearch(searchTerm);
        if (this.gridApi) {
          this.gridApi.setGridOption('quickFilterText', searchTerm);
        }
      });
  }

  // Grid Event Handlers
  onGridReady = (params: GridReadyEvent): void => {
    this.gridApi = params.api;
    // this.columnApi = params.columnApi;
    // console.log(this.gridApi, 'hii');

    if (this.config().fitColumnsOnGridReady) {
      this.gridApi.sizeColumnsToFit();
    }
    // this.gridApi.sizeColumnsToFit();
    if (this.config().autoSizeColumns) {
      this.autoSizeAllColumns();
    }

    // this.updateGridInfo();
    this.gridReady.emit(this.gridApi);
  };

  onRowSelected = (event: RowSelectedEvent): void => {
    this.updateSelectedRows();
    this.rowSelected.emit(event);
    if (this.events.onRowSelected) {
      this.events.onRowSelected(event);
    }
  };

  onSelectionChanged = (event: SelectionChangedEvent): void => {
    this.updateSelectedRows();
    this.selectionChanged.emit(this.selectedRows);
    if (this.events.onSelectionChanged) {
      this.events.onSelectionChanged(event);
    }
  };

  onCellClicked = (event: CellClickedEvent): void => {
    this.cellClicked.emit(event);
    if (this.events.onCellClicked) {
      this.events.onCellClicked(event);
    }
  };

  onRowDoubleClicked = (event: RowDoubleClickedEvent): void => {
    this.rowDoubleClicked.emit(event);
    if (this.events.onRowDoubleClicked) {
      this.events.onRowDoubleClicked(event);
    }
  };

  onFilterChanged = (event: FilterChangedEvent): void => {
    this.updateGridInfo();
    this.filterChanged.emit(event);
    if (this.events.onFilterChanged) {
      this.events.onFilterChanged(event);
    }
  };

  onSortChanged = (event: SortChangedEvent): void => {
    this.sortChanged.emit(event);
    if (this.events.onSortChanged) {
      this.events.onSortChanged(event);
    }
  };

  onColumnResized = (event: ColumnResizedEvent): void => {
    if (this.events.onColumnResized) {
      this.events.onColumnResized(event);
    }
  };

  onPaginationChanged = (event: PaginationChangedEvent): void => {
    // this.autoSizeAllColumns()

    this.updateGridInfo();
    if (this.events.onPaginationChanged) {
      this.events.onPaginationChanged(event);
    }
  };

  onCellValueChanged = (event: CellValueChangedEvent): void => {
    // this.dataChanged.emit(this.getAllRowData());
    if (this.events.onCellValueChanged) {
      this.events.onCellValueChanged(event);
    }
  };

  onRowEditingStopped = (event: RowEditingStoppedEvent): void => {
    if (this.events.onRowEditingStopped) {
      this.events.onRowEditingStopped(event);
    }
  };

  // Search functionality
  onSearchInput(event: any): void {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }

  isExternalFilterPresent = (): boolean => {
    return this.searchTerm.trim().length > 0;
  };

  // ✅ UPDATED: doesExternalFilterPass (Gemini-inspired: Handles getters/formatters)
  doesExternalFilterPass = (node: IRowNode<any>): boolean => {
    if (!this.searchTerm?.trim()) return true;

    const term = this.searchConfig.caseSensitive
      ? this.searchTerm
      : this.searchTerm.toLowerCase();
    const searchableColumns = this.config().columns.filter(
      (col) => col.searchable !== false && !col.hide,
    );

    return searchableColumns.some((col) => {
      let value = node.data[col.field!];

      // ✅ Priority: valueGetter first (computed values like dates)
      if (col.valueGetter && typeof col.valueGetter === 'function') {
        const params: any = {
          data: node.data,
          node,
          colDef: col,
          api: this.gridApi,
        };
        value = col.valueGetter(params);
      }
      // ✅ Fallback: valueFormatter for display-text (e.g., status)
      else if (col.valueFormatter && typeof col.valueFormatter === 'function') {
        const params: any = {
          value,
          data: node.data,
          node,
          colDef: col,
          api: this.gridApi,
        };
        value = col.valueFormatter(params);
      }

      if (value == null) return false;

      const stringValue = this.searchConfig.caseSensitive
        ? String(value)
        : String(value).toLowerCase();
      return stringValue.includes(term);
    });
  };

  // Export functionality
  exportToCsv(): void {
    if (!this.gridApi) return;

    const params = {
      fileName:
        this.config().Title ||
        this.exportConfig.csvFileName ||
        'grid-export.csv',
      skipHeader: !this.exportConfig.includeHeaders,
      onlySelected: this.exportConfig.onlySelected || false,
      columnKeys: this.getExportableColumns(),
      ...this.exportConfig.customExportParams,
    };

    this.gridApi.exportDataAsCsv(params);
  }

  // exportToExcel(): void {
  //   if (!this.gridApi) return;

  //   const params = {
  //     fileName:  this.config.Title || 'grid-export.xlsx',
  //     skipHeader: !this.exportConfig.includeHeaders,
  //     onlySelected: this.exportConfig.onlySelected || false,
  //     columnKeys: this.getExportableColumns(),
  //     ...this.exportConfig.customExportParams,
  //   };

  //   // Note: Excel export requires ag-grid-enterprise
  //   console.warn('Excel export requires AG-Grid Enterprise license');
  //   // this.gridApi.exportDataAsExcel(params);
  // }

  private getExportableColumns(): string[] {
    return this.config()
      .columns.filter((col) => col.exportable !== false && col.field)
      .map((col) => col.field!);
  }

  // Grid utility methods
  refreshGrid(): void {
    if (this.gridApi) {
      if (this.config().serverSideMode) {
        this.gridApi.refreshServerSide({ purge: true });
      } else {
        this.gridApi.refreshCells();
      }
      this.updateGridInfo();
    }
  }

  resetColumns(): void {
    if (this.gridApi) {
      this.gridApi.resetColumnState();
      this.gridApi.resetColumnGroupState();
    }
  }

  autoSizeAllColumns(): void {
    if (this.gridApi) {
      const allColumnIds = this.gridApi
        .getColumnState()
        ?.filter((col: any) => col.hide !== true);
      const colIds = allColumnIds.map((col: any) => col.colId);
      this.gridApi.autoSizeColumns(colIds, false);
      // console.log(allColumnIds, 'allColumnID');
    }
  }
  // autoSizeAllColumns() {
  // const visibleColumns = this.gridColumnApi.getColumnState().filter((col:any) => col.hide !== true);
  // const colIds = visibleColumns.map((col:any) => col.colId);

  // if (colIds.length) {
  //   this.gridColumnApi.autoSizeColumns(colIds, false);
  // }

  fitColumnsToWidth(): void {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  // Data management methods
  updateRowData(newData: any[]): void {
    // this.rowData = [...newData];
    this.originalRowData = [...newData];

    if (this.gridApi && this.config().serverSideMode) {
      // For server-side, you still need to refresh the store
      this.gridApi.refreshServerSide({ purge: true });
    }
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', newData);
    }
    // For client-side, just updating this.rowData is enough.
    // The grid will update automatically.

    // this.updateGridInfo();
    this.dataChanged.emit(this.rowData());
    // this.autoSizeAllColumns()
  }

  addRows(newRows: any[], index?: number): void {
    if (!this.gridApi || this.config().serverSideMode) return;

    if (index !== undefined) {
      this.gridApi.applyTransactionAsync({ add: newRows, addIndex: index });
    } else {
      this.gridApi.applyTransactionAsync({ add: newRows });
    }

    this.updateGridInfo();
  }

  updateRows(updatedRows: any[]): void {
    if (!this.gridApi || this.config().serverSideMode) return;

    this.gridApi.applyTransactionAsync({ update: updatedRows });
    this.updateGridInfo();
  }

  removeRows(rowsToRemove: any[]): void {
    if (!this.gridApi || this.config().serverSideMode) return;

    this.gridApi.applyTransactionAsync({ remove: rowsToRemove });
    this.updateGridInfo();
  }

  clearAllRows(): void {
    if (!this.gridApi) return;

    if (this.config().serverSideMode) {
      this.gridApi.refreshServerSide({ purge: true });
    }

    this.updateGridInfo();
  }

  // Selection methods
  selectAllRows(): void {
    if (this.gridApi) {
      this.gridApi.selectAll();
    }
  }

  deselectAllRows(): void {
    if (this.gridApi) {
      this.gridApi.deselectAll();
    }
  }

  selectRowsByIndex(indices: number[]): void {
    if (!this.gridApi) return;

    this.gridApi.forEachNode((node, index) => {
      if (indices.includes(index)) {
        node.setSelected(true);
      }
    });
  }

  selectRowsById(ids: any[]): void {
    if (!this.gridApi) return;

    this.gridApi.forEachNode((node) => {
      // Use the id property directly from the node
      if (node.id && ids.includes(node.id)) {
        node.setSelected(true);
      }
    });
  }

  getSelectedRows(): any[] {
    return this.gridApi ? this.gridApi.getSelectedRows() : [];
  }

  // Filter methods
  setColumnFilter(
    columnKey: string,
    filterType: string,
    filterValue: any,
  ): void {
    if (!this.gridApi) return;

    // 1. Get the current model for all columns
    const currentModel = this.gridApi.getFilterModel();

    // 2. Create the filter condition for the target column
    // Note: The structure requires specifying the filterType (e.g., 'text', 'number')
    const newColumnFilter = {
      filterType: 'text', // Or 'number', 'date' etc. depending on the column
      type: filterType, // e.g., 'contains', 'equals'
      filter: filterValue, // The value to filter by
    };

    // 3. Apply the new model, merging with any existing filters
    this.gridApi.setFilterModel({
      ...currentModel,
      [columnKey]: newColumnFilter,
    });
  }

  clearAllFilters(): void {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
    }
  }

  getFilterModel(): any {
    return this.gridApi ? this.gridApi.getFilterModel() : null;
  }

  setFilterModel(filterModel: any): void {
    if (this.gridApi) {
      this.gridApi.setFilterModel(filterModel);
    }
  }

  // Sort methods
  setSortModel(sortModel: any[]): void {
    if (this.gridApi) {
      this.gridApi.applyColumnState({
        state: sortModel,
        defaultState: { sort: null }, // This clears any existing sorts first
      });
    }
  }

  getSortModel(): any[] {
    if (!this.gridApi) return [];

    // 1. Get the state of all columns
    const columnState = this.gridApi.getColumnState();

    // 2. Filter for columns that are sorted and map to the old format
    const sortModel = columnState
      .filter((state) => state.sort != null)
      .map((state) => ({
        colId: state.colId,
        sort: state.sort!, // The '!' is safe here because of the filter
      }));

    return sortModel;
  }

  clearSort(): void {
    if (this.gridApi) {
      // This applies a default state of no sort to all columns.
      this.gridApi.applyColumnState({
        defaultState: { sort: null },
      });
    }
  }

  // Column methods
  hideColumns(columnKeys: string[]): void {
    if (this.gridApi) {
      // console.log(columnKeys, 'columnKeys');

      this.gridApi.setColumnsVisible(columnKeys, false);
    }
  }

  showColumns(columnKeys: string[]): void {
    if (this.gridApi) {
      this.gridApi.setColumnsVisible(columnKeys, true);
    }
  }

  pinColumn(columnKey: string, pinned: 'left' | 'right' | null): void {
    if (this.gridApi) {
      this.gridApi.setColumnsPinned([columnKey], pinned); // ✅
    }
  }

  moveColumn(columnKey: string, toIndex: number): void {
    if (this.gridApi) {
      this.gridApi.moveColumns([columnKey], toIndex); // ✅
    }
  }

  resizeColumn(columnKey: string, width: number): void {
    if (this.gridApi) {
      this.gridApi.setColumnWidths([{ key: columnKey, newWidth: width }]); // ✅
    }
  }

  // Navigation methods
  scrollToRow(rowIndex: number): void {
    if (this.gridApi) {
      this.gridApi.ensureIndexVisible(rowIndex, 'middle');
    }
  }

  scrollToColumn(columnKey: string): void {
    if (this.gridApi) {
      this.gridApi.ensureColumnVisible(columnKey);
    }
  }

  focusCell(rowIndex: number, columnKey: string): void {
    if (this.gridApi) {
      this.gridApi.setFocusedCell(rowIndex, columnKey);
    }
  }

  // Helper methods
  private updateSelectedRows(): void {
    this.selectedRows = this.getSelectedRows();
  }

  private updateGridInfo(): void {
    if (!this.gridApi) return;

    this.totalRows = this.gridApi.getDisplayedRowCount();
    this.filteredRows = this.gridApi.getDisplayedRowCount();

    // Update total rows for client-side mode
    if (!this.config().serverSideMode) {
      this.gridApi.forEachNode(() => this.totalRows++);
    }
  }

  getAllRowData(): any[] {
    if (!this.gridApi) return [];

    const rowData: any[] = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data));
    return rowData;
  }

  // getRowId = (params: GetRowIdParams): string => {
  //   // Customize this based on your data structure
  //   return params.data.id || params.data.uuid || String(Math.random());
  // };

  getRowId = (params: GetRowIdParams): string => {
    // ⚠️ DHYAN DEIN: Ab hume 'this.uniqueRowKey()' likhna hoga kyunki ye ek signal hai
    const currentKey = this.uniqueRowKey();

    // Nullish Coalescing Logic
    const rowId =
      params.data[currentKey] ??
      params.data.id ??
      params.data.uuid ??
      String(Math.random());

    if (rowId !== undefined && rowId !== null) {
      return String(rowId);
    }

    // Fallback Warning
    console.warn(
      `AG-Grid Alert: Row me '${currentKey}' ya 'id' nahi mila.`,
      params.data,
    );
    return params.data.id;
  };

  getDataPath = (data: any): string[] => {
    // For tree data - customize based on your data structure
    return data.orgHierarchy || [];
  };

  // getContextMenuItems = (params: GetContextMenuItemsParams): (DefaultMenuItem | MenuItemDef)[] => {
  //   if (!this.config.customContextMenu) return [];

  //   // Explicitly type the array
  //   const result: (DefaultMenuItem | MenuItemDef)[] = [
  //     'copy',
  //     'copyWithHeaders',
  //     'separator',
  //     {
  //       name: 'Export Selected',
  //       action: () => this.exportToCsv(),
  //       disabled: this.selectedRows.length === 0
  //     },
  //     'separator',
  //     {
  //       name: 'Auto Size Columns',
  //       action: () => this.autoSizeAllColumns()
  //     },
  //     {
  //       name: 'Reset Columns',
  //       action: () => this.resetColumns()
  //     }
  //   ];
  //   return result;
  // };

  // Styling and theme methods

  getThemeClass(): string {
    const theme = this.config().theme || 'alpine';
    return `ag-theme-${theme}`;
  }

  get containerStyles(): any {
    return {
      width: this.config().width || '100%',
      height: 'auto',
    };
  }

  // Loading state management
  showLoadingOverlay(): void {
    this.isLoading = true;
  }

  hideLoadingOverlay(): void {
    this.isLoading = false;
  }

  showNoRowsOverlay(): void {
    if (this.gridApi) {
      this.gridApi.showNoRowsOverlay();
    }
  }

  // Cell editing methods
  startEditingCell(rowIndex: number, columnKey: string): void {
    if (this.gridApi && this.config().enableCellEditing) {
      this.gridApi.startEditingCell({
        rowIndex: rowIndex,
        colKey: columnKey,
      });
    }
  }

  stopEditing(): void {
    if (this.gridApi) {
      this.gridApi.stopEditing();
    }
  }

  // Validation methods
  validateAllRows(): { isValid: boolean; errors: any[] } {
    const errors: any[] = [];
    let isValid = true;

    if (!this.gridApi) return { isValid, errors };

    this.gridApi.forEachNode((node, index) => {
      const rowErrors = this.validateRow(node.data, index);
      if (rowErrors.length > 0) {
        isValid = false;
        errors.push(...rowErrors);
      }
    });

    return { isValid, errors };
  }

  private validateRow(rowData: any, rowIndex: number): any[] {
    const errors: any[] = [];

    this.config().columns.forEach((col) => {
      if (col.validation && col.field) {
        const value = rowData[col.field];
        const validationResult = col.validation(value);

        if (validationResult !== true) {
          errors.push({
            row: rowIndex,
            column: col.field,
            value: value,
            error:
              typeof validationResult === 'string'
                ? validationResult
                : 'Invalid value',
          });
        }
      }
    });

    return errors;
  }

  exportToExcel(): void {
    if (!this.gridApi) {
      // console.warn('Grid API not available');
      return;
    }

    // Get the data to export based on configuration
    // const exportData = this.getExportData();

    // Validate data before export
    // console.log(exportData,this.processedColumnDefs,"exportToExcel");

    // const validation = this.excelExportService.validateExportData(grid, this.processedColumnDefs);
    // if (!validation.isValid) {
    //   console.error('Export validation failed:', validation.errors);
    //   alert('Cannot export: ' + validation.errors.join(', '));
    //   return;
    // }

    // Configure export options

    const exportOptions: ExcelExportOptions = {
      fileName: this.config().Title || 'grid-export.xlsx',
      sheetName: 'Data',
      includeHeaders: this.exportConfig.includeHeaders !== false,
      onlySelected: this.exportConfig.onlySelected || false,
      onlyVisible: true,

      addTimestamp: true,
      autoFilterHeaders: true,
      freezeHeaderRow: true,
      columnWidthMultiplier: 1.3,
    };

    // Configure styling options
    const styleOptions: ExcelStyleOptions = {
      headerBackgroundColor: '#4472C4',
      headerFontColor: '#FFFFFF',
      headerFontBold: true,
      alternateRowColors: true,
      borderStyle: 'thin',
    };

    try {
      this.excelExportService.exportToExcel(
        this.gridApi,
        this.processedColumnDefs(),
        exportOptions,
        styleOptions,
      );

      console.log('Excel export completed successfully');
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Export failed. Please try again.');
    }
  }
  /**
   * Export grid data to PDF with advanced features
   */
  exportToPdf(customOptions?: Partial<PdfExportOptions>): void {
    if (!this.gridApi) {
      console.warn('Grid API not available for PDF export');
      return;
    }

    // Configure PDF export options
    const pdfOptions: PdfExportOptions = {
      fileName: this.config().pdfTitle || 'grid-export.pdf',
      title: this.config().Title || this.config().pdfTitle || 'Data Export',
      subtitle: `Exported on ${new Date().toLocaleDateString()}`,
      orientation: 'landscape',
      pageSize: 'a4',
      includeHeaders: true,
      onlySelected: false,
      addTimestamp: true,
      addPageNumbers: true,
      customStyles: {
        primaryColor: '#2563eb',
        headerBackgroundColor: '#1e40af',
        headerTextColor: '#ffffff',
        alternateRowColors: true,
        theme: 'grid',
      },
      ...customOptions,
    };

    try {
      this.pdfExportService.exportToPdf(
        this.gridApi,
        this.processedColumnDefs() as GridColumnConfig[],
        pdfOptions,
      );
      console.log('PDF export initiated successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  }

  /**
   * Export only selected rows to PDF
   */
  exportSelectedToPdf(): void {
    const selectedRows = this.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('No rows selected for export');
      return;
    }

    this.exportToPdf({
      onlySelected: true,
      title: `Selected Rows Export (${selectedRows.length} rows)`,
      fileName: 'selected-rows-export.pdf',
    });
  }

  /**
   * Export PDF with custom styling
   */
  exportStyledPdf(): void {
    this.exportToPdf({
      title: 'Custom Styled Report',
      customStyles: {
        primaryColor: '#059669',
        headerBackgroundColor: '#047857',
        headerTextColor: '#ffffff',
        fontSize: 11,
        headerFontSize: 13,
        alternateRowColors: true,
        borderStyle: 'medium',
        theme: 'grid',
      },
      logo: {
        src: '/assets/logo.png', // Add your logo path
        width: 30,
        height: 20,
        x: 20,
        y: 10,
      },
      watermark: 'CONFIDENTIAL',
    });
  }

  /**
   * Get PDF export progress
   */
  get pdfExportProgress() {
    return this.pdfExportService.progress;
  }

  /**
   * Check if PDF export is in progress
   */
  get isPdfExporting() {
    return this.pdfExportService.exporting;
  }

  /**
   * Export with preview option
   */
  async exportPdfWithPreview(): Promise<void> {
    if (!this.gridApi) return;

    try {
      const previewUrl = await this.pdfExportService.getExportPreview(
        this.gridApi,
        this.processedColumnDefs() as GridColumnConfig[],
        {
          title: this.config().Title || 'Preview Export',
          fileName: 'preview.pdf',
        },
      );

      // Open preview in new window
      const previewWindow = window.open();
      if (previewWindow) {
        previewWindow.document.write(
          `<iframe src="${previewUrl}" style="width:100%;height:100%;border:none;"></iframe>`,
        );
      }
    } catch (error) {
      console.error('PDF preview failed:', error);
    }
  }

  /**
   * Export multiple sections (if you have multiple grids)
   */
  async exportMultipleGridsToPdf(): Promise<void> {
    // Example of exporting multiple grids - adapt to your needs
    const grids = [
      {
        gridApi: this.gridApi,
        columns: this.processedColumnDefs() as GridColumnConfig[],
        title: 'Main Data',
        options: { pageSize: 'a4' as const },
      },
      // Add more grids here if needed
    ];

    try {
      await this.pdfExportService.exportMultipleGrids(
        grids,
        'multi-grid-export.pdf',
      );
    } catch (error) {
      console.error('Multi-grid PDF export failed:', error);
    }
  }
  /**
   * Get data to export based on configuration
   */
  private getExportData(): any[] {
    if (!this.gridApi) return [];

    // Export selected rows only if specified
    if (this.exportConfig.onlySelected) {
      const selectedRows = this.getSelectedRows();
      if (selectedRows.length === 0) {
        alert('No rows selected for export');
        return [];
      }
      return selectedRows;
    }

    // Export filtered and sorted data
    const exportData: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
      // console.log(node);

      exportData.push(node.data);
    });

    return exportData;
  }

  /**
   * Export multiple sheets (bonus feature)
   */
  exportMultipleSheets(): void {
    if (!this.gridApi) return;

    const sheets = [
      {
        gridApi: this.gridApi,
        columns: this.processedColumnDefs(),
        sheetName: 'All Data',
      },
      {
        gridApi: this.gridApi,
        columns: this.processedColumnDefs(),
        sheetName: 'Selected Data',
      },
    ];

    this.excelExportService.exportMultipleSheets(
      sheets,
      `${this.config().Title || 'export'}_multi-sheet.xlsx`,
    );
  }
}
