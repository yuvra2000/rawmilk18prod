// import { Component, signal, computed } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// import { ICellRendererAngularComp } from 'ag-grid-angular';
// import { ActionConfig } from './interfaces';
// import { CELL_RENDERER_BASE_CONFIG } from './utils';
// import { CommonModule } from '@angular/common';
// import { ICellRendererParams } from 'ag-grid-community';

// @Component({
//   selector: 'app-action-cell-renderer',
//   imports: [CommonModule],
//   ...CELL_RENDERER_BASE_CONFIG,
//   template: `
//     <div class="action-cell">
//       @for (action of actions(); track $index) {
//         <button
//           [class]="'action-btn ' + (action.cssClass || 'btn-primary')"
//           [disabled]="action.disabled?.(rowData()) || false"
//           (click)="onActionClick(action)"
//           [title]="action.tooltip || action.label"
//           type="button">
//           @if (action.icon) {
//             @if (action.isImg) {
//               <img 
//                 [src]="action.icon" 
//                 [style]="action.iconStyle" 
//                 alt="icon" 
//                 class="action-icon-img" 
//               />
//             } @else {
//               <i [class]="action.icon" [style]="action.iconStyle"></i>
//             }
//           }
//           @if (action.label) {
//             <span>{{ action.label }}</span>
//           }
//         </button>
//       }
//     </div>
//   `,
//   standalone:true,
//   styleUrl: './styles/action-cell-renderer.scss'
// })
// export class ActionCellRenderer implements ICellRendererAngularComp {
//   private params = signal<ICellRendererParams | null>(null);
  
//   actions = computed(() => this.params()?.actions || []);
//   rowData = computed(() => this.params()?.data);

//   agInit(params: ICellRendererParams): void {
//     this.params.set(params);
//   }

//   refresh(params: ICellRendererParams): boolean {
//     this.params.set(params);
//     return true;
//   }

//   onActionClick(action: ActionConfig): void {
//     const data = this.rowData();
//     const params = this.params();
//     if (action.onClick && data && params) {
//       action.onClick(data, params.node);
//     }
//   }
// }



import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IRowNode } from 'ag-grid-community';
import { ActionConfig } from './interfaces';
// --- It's best practice to define interfaces in a separate file ---


export interface IActionCellRendererParams extends ICellRendererParams {
  actions: ActionConfig[];
}
// --------------------------------------------------------------------

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule],
    template: `
    <div class="action-cell">
      @for (action of actions(); track $index) {
        <button
          [class]="'action-btn ' + (action.cssClass || 'btn-primary')"
          [disabled]="action.disabled?.(rowData()) || false"
          (click)="onActionClick(action)"
          [title]="action.tooltip || action.label"
          type="button">
          @if (action.icon) {
            @if (action.isImg) {
              <img 
                [src]="action.icon" 
                [style]="action.iconStyle" 
                alt="icon" 
                class="action-icon-img" 
              />
            } @else {
              <i [class]="action.icon" [style]="action.iconStyle"></i>
            }
          }
          @if (action.label) {
            <span>{{ action.label }}</span>
          }
        </button>
      }
    </div>
  `,
  styleUrl: './styles/action-cell-renderer.scss'
})
export class ActionCellRenderer implements ICellRendererAngularComp {
  // Use the new, stronger type for the signal
  private params = signal<IActionCellRendererParams | null>(null);
  
  // These computed signals are already perfect
  readonly actions = computed(() => this.params()?.actions || []);
  readonly rowData = computed(() => this.params()?.data);

  agInit(params: IActionCellRendererParams): void {
    this.params.set(params);
  }

  refresh(params: IActionCellRendererParams): boolean {
    this.params.set(params);
    return true;
  }

  onActionClick(action: ActionConfig): void {
    const data = this.rowData();
    const params = this.params();
    if (action.onClick && data && params) {
      action.onClick(data, params.node);
    }
  }
}