import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  TemplateRef,
  Signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AdvancedGridComponent,
  GridColumnConfig,
  GridConfig,
  ActionCellRendererComponent,
} from '../../../ag-grid/ag-grid/ag-grid.component';
import { ReusableModalComponent } from '../../reusable-modal.component';
import { AlertService } from '../../../../services/alert.service';

export interface GridModalConfig {
  title: string;
  subtitle?: string;
  gridConfig?: GridConfig;
  rowData?: any[];
  columns: GridColumnConfig[];
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  showCloseButton?: boolean;
  onSelection?: (selectedRows: any[]) => void;
  onGridReady?: (gridApi: any) => void;
  showFooter?: boolean;
  saveText?: string;
  cancelText?: string;
  selectionMode?: 'single' | 'multiple';
  gridLeftSlotTpl?: Signal<TemplateRef<any> | null>;
  filterButtonClass?: string;
  enableGridFilter?: boolean;
  gridFilterMapping?: Record<string, string>;
  height?: string;
  context?: any;
  onActionClick?: (actionType: string, rowData: any) => void;
}

@Component({
  selector: 'app-grid-modal',
  standalone: true,
  imports: [CommonModule, ReusableModalComponent, AdvancedGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-modal
      #gridModal
      [title]="config()?.title || 'Data Table'"
      [subtitle]="config()?.subtitle || ''"
      [showSaveButton]="config()?.showFooter ? true : false"
      [saveText]="config()?.saveText || ''"
      [showCloseButton]="config()?.showCloseButton ?? true"
      [showFooter]="config()?.showFooter !== false"
      [onSaveAction]="handleSave.bind(this)"
      bodyClass="grid-modal-body"
      bodyHeight="auto"
      [cancelText]="config()?.cancelText || 'Close'"
      (keydown.escape)="activeModal.dismiss()"
      [showCancelButton]="config()?.showFooter ? true : false"
    >
      <div class="grid-modal-container">
        <!-- Grid Component -->
        <app-advanced-grid
          [config]="resolvedGridConfig()"
          [rowData]="resolvedRowData()"
          [searchConfig]="{ enabled: true, placeholder: 'Search...' }"
          (gridReady)="onGridReady($event)"
          (selectionChanged)="onSelectionChanged($event)"
        ></app-advanced-grid>
      </div>
    </app-base-modal>
  `,
  styles: [
    `
      .grid-modal-container {
        display: flex;
        gap: 15px;
        align-items: stretch;
        min-height: 400px;
      }

      .grid-left-slot {
        flex: 0 0 auto;
        max-width: 300px;
        overflow-y: auto;
        padding: 10px;
        border-right: 1px solid #d3d3d3;
      }

      app-advanced-grid {
        flex: 1;
      }

      :host ::ng-deep .grid-modal-body {
        max-height: 70vh;
        overflow: auto;
      }
    `,
  ],
})
export class GridModalComponent {
  readonly activeModal = inject(NgbActiveModal);
  private alertService = inject(AlertService);

  readonly config = signal<GridModalConfig | null>(null);
  private selectedRows = signal<any[]>([]);
  private gridApi: any = null;

  readonly resolvedGridConfig = computed((): GridConfig => {
    const cfg = this.config();
    if (!cfg)
      return {
        theme: 'alpine',
        columns: [],
        rowSelection: 'multiple',
      };

    return {
      ...(cfg.gridConfig || {}),
      columns: cfg.columns || [],
      rowSelection: cfg.selectionMode === 'single' ? 'single' : 'multiple',
      suppressRowClickSelection: false,
      height: cfg.height || '60vh',
      context: {
        ...cfg.context,
        handleActionClick: (actionType: string, rowData: any) => {
          this.handleGridAction(actionType, rowData);
        },
      },
    } as GridConfig;
  });
  private handleGridAction(actionType: string, rowData: any): void {
    const cfg = this.config();

    if (cfg?.onActionClick) {
      cfg.onActionClick(actionType, rowData);
    }

    // Modal closes itself
    setTimeout(() => {
      this.activeModal.close({ action: actionType, data: rowData });
    }, 100);
  }
  readonly resolvedRowData = computed(() => {
    const cfg = this.config();
    if (!cfg) return [];

    const data = cfg.rowData;
    if (!data) return [];

    // Handle signal or array
    return Array.isArray(data) ? data : data;
  });

  handleSave(): void {
    const selected = this.selectedRows();

    if (selected.length === 0) {
      this.alertService.warning('Please select at least one row');
      return;
    }

    const cfg = this.config();
    if (cfg?.onSelection) {
      cfg.onSelection(selected);
    }

    this.activeModal.close(selected);
  }
  close() {
    debugger;
    console.log('Modal closed');
    this.activeModal.close();
  }
  onGridReady(event: any): void {
    this.gridApi = event;
    const cfg = this.config();
    if (cfg?.onGridReady) {
      cfg.onGridReady(event);
    }
  }

  onSelectionChanged(event: any): void {
    if (this.gridApi) {
      const selectedNodes = this.gridApi.getSelectedNodes?.();
      const selectedData = selectedNodes?.map((node: any) => node.data) || [];
      this.selectedRows.set(selectedData);
    }
  }
}
