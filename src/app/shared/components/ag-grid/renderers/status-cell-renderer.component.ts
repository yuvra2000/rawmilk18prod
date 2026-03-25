// import { Component, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ICellRendererAngularComp, ICellRendererParams } from 'ag-grid-angular';
// import { BadgeConfig } from './interfaces';
// import { CELL_RENDERER_BASE_CONFIG, getStatusVariant, formatDisplayValue } from './utils';

// @Component({
//   selector: 'app-status-cell-renderer',
//   imports: [CommonModule],
//   ...CELL_RENDERER_BASE_CONFIG,
//   template: `
//     <span [class]="badgeClasses()" [title]="value()">
//       @if (icon()) {
//         <i [class]="icon()"></i>
//       }
//       {{ displayValue() }}
//     </span>
//   `,
//   styleUrl: './styles/status-cell-renderer.scss'
// })
// export class StatusCellRenderer implements ICellRendererAngularComp {
//   private params = signal<ICellRendererParams | null>(null);
  
//   value = computed(() => this.params()?.value || '');
//   config = computed(() => this.params()?.colDef?.cellRendererParams as BadgeConfig || {});
  
//   displayValue = computed(() => formatDisplayValue(this.value()));

//   icon = computed(() => {
//     const iconField = this.config().iconField;
//     const data = this.params()?.data;
//     return iconField && data ? data[iconField] : '';
//   });

//   badgeClasses = computed(() => {
//     const variant = this.config().variant || getStatusVariant(this.value());
//     return `status-badge status-${variant}`;
//   });

//   agInit(params: ICellRendererParams): void {
//     this.params.set(params);
//   }

//   refresh(params: ICellRendererParams): boolean {
//     this.params.set(params);
//     return true;
//   }
// }
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, ColDef } from 'ag-grid-community';
import { getStatusVariant, formatDisplayValue } from './utils'; // Assuming these are in a utils file
import { BadgeConfig } from './interfaces';
// --- It's best practice to define interfaces in a separate file ---


export interface IBadgeCellRendererParams extends ICellRendererParams {
  colDef: ColDef & {
    cellRendererParams?: BadgeConfig;
  }
}
// --------------------------------------------------------------------

@Component({
  selector: 'app-status-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()" [title]="value()">
      @if (icon()) {
        <i [class]="icon()"></i>
      }
      {{ displayValue() }}
    </span>
  `,
  styleUrl: './styles/status-cell-renderer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusCellRenderer implements ICellRendererAngularComp {
  // Use the new, stronger type for the params signal
  private params = signal<IBadgeCellRendererParams | null>(null);
  
  // These computed signals are already perfectly implemented
  readonly value = computed(() => this.params()?.value || '');
  readonly config = computed(() => this.params()?.colDef?.cellRendererParams || {});
  readonly displayValue = computed(() => formatDisplayValue(this.value()));

  readonly icon = computed(() => {
    const iconField = this.config().iconField;
    const data = this.params()?.data;
    return iconField && data ? data[iconField] : '';
  });

  readonly badgeClasses = computed(() => {
    // Logic is perfect: uses a configured variant or derives it from the value
    const variant = this.config().variant || getStatusVariant(this.value());
    return `status-badge status-${variant}`;
  });

  agInit(params: IBadgeCellRendererParams): void {
    this.params.set(params);
  }

  refresh(params: IBadgeCellRendererParams): boolean {
    this.params.set(params);
    return true;
  }
}