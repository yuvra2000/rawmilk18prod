import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

const COLOR_MAP: Record<string, string> = {
  S20: '#856404',
  S30: '#721c24',
  'LID TAMPERING': '#004085',
  'TANKER HOLD': '#5a2d82',
};
const BG_MAP: Record<string, string> = {
  S20: '#fff3cd',
  S30: '#f8d7da',
  'LID TAMPERING': '#cce5ff',
  'TANKER HOLD': '#e8d5f5',
};

export interface AlertBadge {
  type: string;
  count: number;
  items: any[];
  color: string;
  bg: string;
}

@Component({
  selector: 'app-alerts-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (badges().length === 0) {
      <span style="color:#28a745;font-size:12px">✓ None</span>
    } @else {
      <div class="alerts-cell-wrap">
        @for (badge of badges(); track badge.type) {
          <span
            class="alert-badge"
            [style.background]="badge.bg"
            [style.color]="badge.color"
            (click)="onBadgeClick($event, badge)"
            [title]="'Click to view ' + badge.count + ' ' + badge.type + ' alert(s)'"
          >
            {{ badge.type }}<sup>{{ badge.count }}</sup>
          </span>
        }
      </div>
    }
  `,
  styles: [`
    .alerts-cell-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      height: 100%;
    }
    .alert-badge {
      padding: 2px 2px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 1px;
      transition: opacity 0.15s, transform 0.1s;
      border: 1px solid transparent;
      height: 22px;
    }
    .alert-badge:hover {
      opacity: 0.8;
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .alert-badge sup {
      font-size: 9px;
      font-weight: 800;
      margin-left: 2px;
      vertical-align: super;
    }
  `],
})
export class AlertsCellRendererComponent implements ICellRendererAngularComp, OnDestroy {
  private params = signal<ICellRendererParams | null>(null);

  readonly badges = computed<AlertBadge[]>(() => {
    const alertData = this.params()?.value;
    if (!alertData || typeof alertData !== 'object') return [];
    return Object.entries(alertData)
      .filter(([, v]) => Array.isArray(v) && (v as any[]).length > 0)
      .map(([type, items]) => ({
        type,
        count: (items as any[]).length,
        items: items as any[],
        color: COLOR_MAP[type] || '#383d41',
        bg: BG_MAP[type] || '#e2e3e5',
      }));
  });

  agInit(params: ICellRendererParams): void {
    this.params.set(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.params.set(params);
    return true;
  }

  ngOnDestroy(): void {
    this.params.set(null);
  }

  onBadgeClick(event: MouseEvent, badge: AlertBadge): void {
    event.stopPropagation();
    const parent = (this.params() as any)?.context?.componentParent;
    if (parent?.onAlertClick) {
      parent.onAlertClick(badge.type, badge.items, this.params()?.data);
    }
  }
}
