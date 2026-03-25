import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { BooleanConfig } from './interfaces';
// import { IBooleanCellRendererParams } from './interfaces'; // Import custom interfaces
// Create a custom params interface with typed cellRendererParams
export interface IBooleanCellRendererParams extends ICellRendererParams {
  colDef: ColDef & {
    cellRendererParams?: BooleanConfig;
  }
}
@Component({
  selector: 'app-boolean-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="boolean-cell" [style.color]="iconColor()">
      <i [class]="iconClass()">{{ iconName() }}</i>
      @if (showText()) {
        <span>{{ displayText() }}</span>
      }
    </div>
  `,
  styleUrl: './styles/boolean-cell-renderer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooleanCellRenderer implements ICellRendererAngularComp {
  private params = signal<IBooleanCellRendererParams | null>(null);
  
  readonly value = computed(() => Boolean(this.params()?.value));
  readonly config = computed(() => this.params()?.colDef?.cellRendererParams || {});
  
  // This computed signal now ONLY handles the class (e.g., 'material-icons' or 'fa-solid')
  readonly iconClass = computed(() => {
    const cfg = this.config();
    const isTrue = this.value();
    return isTrue ? (cfg.trueIcon || 'material-icons') : (cfg.falseIcon || 'material-icons');
  });

  // NEW: A dedicated computed signal for the icon NAME
  readonly iconName = computed(() => {
    const cfg = this.config();
    // If custom icons are used (like Font Awesome), the name is part of the class, so return empty.
    if (cfg.trueIcon || cfg.falseIcon) {
      return '';
    }
    // Otherwise, return the default Material Icon names.
    return this.value() ? 'check_circle' : 'cancel';
  });
  
  readonly iconColor = computed(() => {
    return this.value() ? '#10b981' : '#ef4444'; // Softer green/red for modern look
  });

  readonly displayText = computed(() => {
    const cfg = this.config();
    const isTrue = this.value();
    return isTrue ? (cfg.trueText || 'Yes') : (cfg.falseText || 'No');
  });

  readonly showText = computed(() => this.config().showText !== false);

  agInit(params: IBooleanCellRendererParams): void {
    this.params.set(params);
  }

  refresh(params: IBooleanCellRendererParams): boolean {
    this.params.set(params);
    return true;
  }
}