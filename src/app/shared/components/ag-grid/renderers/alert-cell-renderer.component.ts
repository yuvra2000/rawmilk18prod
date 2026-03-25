// alert-cell-renderer.component.ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
// alert-cell.model.ts

/**
 * 🎯 Strict Handler Interface
 * Ye define karta hai ki parent component se kon-kon se functions pass kiye ja sakte hain.
 */
/**
 * 🎯 The Strict Handler Interface (For Legacy & Shared Functions)
 * Isme wo saare functions define honge jo parent apne `handler` object ke andar bhej sakta hai.
 */
export type AlertActionHandler = Record<string, (...args: any[]) => void>;

/**
 * ⚙️ The Main Grid Cell Params Interface
 */
export interface CustomAlertCellParams<T = any> {
  // 🏛️ Legacy/Dynamic Handler (Ab ye poori tarah generic hai)
  handler?: AlertActionHandler;

  // 🚀 Modern Direct Click Methods (Aap naye grids me yahi use karengi)
  onCellClick?: (rowData: T) => void;
  onExtraIconClick?: (rowData: T) => void;

  // ⚙️ Configurations
  isTriggerData?: boolean;
  showCount?: boolean;
  showExtraIcon?: boolean;
  extraIconClass?: string;

  // 🔗 Dynamic Mappers
  nameKey?: string;
  colorKey?: string;
  mediaIdKey?: string;
}
@Component({
  selector: 'app-alert-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="alert-wrapper" (click)="onClick()">
      @for (a of alerts(); track a.alert_name) {
        <span class="alert-item" [title]="a.alert_name">
          <i class="fa fa-square" [style.color]="a.last_color"></i>
          <span class="alert-name">{{ a.alert_name }}</span>

          @if (showCount()) {
            <sup class="alert-count">{{ a.total_count }}</sup>
          }
          @if (a.grace_info && a.grace_info.finalTime > 0) {
            <label
              class="ms-2 mb-0"
              style="cursor: pointer;"
              [title]="
                a.grace_info.alert_type + '-' + a.grace_info.escalation_type
              "
            >
              <i
                class="fa fa-clock-o text-info"
                style="font-size: 16px; vertical-align: middle;"
              ></i>
              <sup class="ms-1">
                <span
                  class=" badge rounded-pill alert-name {{ graceClass() }}"
                  style="font-size: 10px; background-color: white !important; border: 2px dotted;"
                >
                  {{ a.grace_info.finalTime || 0 }}
                </span>
              </sup>
            </label>
          }
          @if (showActionIcon() && a.media_id) {
            <i
              [class]="extraIconClass()"
              title="Action"
              (click)="onDynamicIconClick($event, a)"
            >
            </i>
          }
        </span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }
      .alert-wrapper {
        display: inline;
        cursor: pointer;
      }
      .alert-item {
        display: inline-block;
        margin-right: 15px;
        vertical-align: middle;
      }
      .fa-square {
        font-size: 14px;
        vertical-align: middle;
      }
      .alert-name {
        color: black;
        font-size: 13px;
        font-weight: 500;
        margin-left: 4px;
        font-family: sans-serif;
        vertical-align: middle;
      }
      .alert-count {
        color: red;
        font-size: 11px;
        font-weight: bold;
        margin-left: 2px;
      }
      .dynamic-action-icon {
        cursor: pointer;
        transition: transform 0.2s ease-in-out;
        vertical-align: middle;
      }
      .dynamic-action-icon:hover {
        transform: scale(1.1);
      }
      .grace-light {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        margin-left: 6px;
        display: inline-block;
        white-space: nowrap;
      }

      .grace-warning {
        background: #fefce8;
        color: #854d0e;
        border: 1px solid #fcd34d;
      }

      .grace-critical {
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #f87171;
      }
    `,
  ],
})
export class AlertCellRendererComponent implements ICellRendererAngularComp {
  // UI Signals
  alerts = signal<any[]>([]);
  showCount = signal<boolean>(true);
  showActionIcon = signal<boolean>(false);
  extraIconClass = signal<string>('fa fa-info-circle ms-2 dynamic-action-icon');

  // 🚀 Naye Signals Grace aur Lock ke liye
  graceAlerts = signal<any[]>([]);
  displayLock = signal<string>('');
  // AG-Grid Context
  params!: ICellRendererParams;
  customParams!: CustomAlertCellParams;
  graceTime = signal<number>(0);
  graceClass = signal<string>('grace-normal'); // normal | warning | critical

  customClickHandler: ((rowData: any) => void) | undefined = undefined;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.customParams = params.colDef
      ?.cellRendererParams as CustomAlertCellParams;

    // UI Configurations apply karein (with strict defaults)
    this.showCount.set(this.customParams?.showCount ?? true);
    this.showActionIcon.set(this.customParams?.showExtraIcon ?? false);

    if (this.customParams?.extraIconClass) {
      this.extraIconClass.set(
        `${this.customParams.extraIconClass} dynamic-action-icon`,
      );
    }

    if (this.customParams?.onExtraIconClick) {
      this.customClickHandler = this.customParams.onExtraIconClick;
    }

    this.processData();
    // 🔥 YE LINE ADD KARO – Sabse Last Mein
    const firstActiveGrace = this.alerts().find(
      (a) => a.grace_info?.finalTime > 0,
    );
    this.updateGraceUI(firstActiveGrace?.grace_info);
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.customParams = params.colDef
      ?.cellRendererParams as CustomAlertCellParams;

    this.processData();
    // 🔥 YE LINE ADD KARO – Sabse Last Mein
    const firstActiveGrace = this.alerts().find(
      (a) => a.grace_info?.finalTime > 0,
    );
    this.updateGraceUI(firstActiveGrace?.grace_info);
    return true; // True ensures smooth re-rendering without flickering
  }

  /**
   * 🧠 Data Mapper: Legacy aur New Trigger data dono ko handle karta hai
   */
  private updateGraceUI(grace: any) {
    const time = grace?.finalTime ?? 0;
    this.graceTime.set(time);

    if (time <= 5) this.graceClass.set('grace-critical');
    else if (time <= 15) this.graceClass.set('grace-warning');
    else this.graceClass.set('grace-normal');
  }
  private processData() {
    const data = this.params.data || {};

    // 🔒 Set Lock Status
    this.displayLock.set(data.displayLock?.toUpperCase() || '');

    // ⏳ Extract & Set Grace Alerts
    const allAlerts = data.alerts || [];
    const graceEscalations = allAlerts.filter(
      (a: any) => a.escalation_type === 'grace',
    );

    if (this.customParams?.isTriggerData) {
      // ✨ 1. Dynamic Keys ko read karein (Agar parent ne nahi bheja, toh default use karein)
      const nameField = this.customParams.nameKey || 'AlertType';
      const colorField = this.customParams.colorKey || 'color';
      const mediaField = this.customParams.mediaIdKey || 'media_id';
      const alertName = data[nameField];
      // Find if this specific trigger has a grace
      const matchingGrace = graceEscalations.find(
        (g: any) => g.alert_type === alertName,
      );

      // ✨ 2. Bracket notation [ ] ka use karke dynamically data extract karein
      this.alerts.set([
        {
          alert_name: alertName, // 'AlertType' ya 'alertname'
          last_color: this.params.data?.[colorField] || 'gray', // 'color'
          media_id: this.params.data?.[mediaField],
          grace_info: matchingGrace, // 'media_id'
        },
      ]);
    } else {
      const rawSummary = data.alerts_summary || [];

      const mergedSummary = rawSummary.map((summaryItem: any) => {
        // 🚀 THE FIX: Smart Grace Matcher
        const matchingGrace = graceEscalations.find((g: any) => {
          // 1. Direct Match Check karega (e.g., "TAMPER_LOCK" === "TAMPER_LOCK")
          if (g.alert_type === summaryItem.alert_name) {
            return true;
          }

          // 2. Deep Match Check karega (e.g., g.alert_type "SCHEDULED_HALT" === summary "SCH" ka count_detail type)
          if (
            summaryItem.count_detail &&
            Array.isArray(summaryItem.count_detail)
          ) {
            return summaryItem.count_detail.some(
              (detail: any) => detail.type === g.alert_type,
            );
          }

          return false;
        });

        return {
          ...summaryItem,
          grace_info: matchingGrace, // 👈 Ab yahan undefined nahi aayega!
        };
      });

      this.alerts.set(mergedSummary);
    }
    // 🔥 YE LINE ADD KARO – Sabse Last Mein
    const firstActiveGrace = this.alerts().find(
      (a) => a.grace_info?.finalTime > 0,
    );
    this.updateGraceUI(firstActiveGrace?.grace_info);
  }
  /**
   * 🏛️ Legacy Row Click Handler
   */
  /**
   * 🎯 Smart Row Click Handler
   */
  onClick() {
    if (this.alerts().length === 0 && this.graceAlerts().length === 0) return;

    if (this.alerts().length === 0) return;

    // ✨ 1. Modern Way (Priority 1)
    if (this.customParams?.onCellClick) {
      this.customParams.onCellClick(this.params.data);
      return;
    }

    // 🏛️ 2. Legacy Way (Dynamic Dictionary Check)
    const legacyHandler = this.customParams?.handler;
    if (legacyHandler) {
      // Bracket notation use karke safely function call karein
      if (typeof legacyHandler['alertInfo'] === 'function') {
        legacyHandler['alertInfo'](this.params.data);
      } else if (typeof legacyHandler['lastAlertF'] === 'function') {
        legacyHandler['lastAlertF'](this.params.data);
      }
    }
  }

  /**
   * ✨ Extra Icon Click Handler
   */
  onDynamicIconClick(event: MouseEvent, item: any) {
    event.stopPropagation();

    // ✨ 1. Modern Way (Priority 1)
    if (this.customParams?.onExtraIconClick) {
      this.customParams.onExtraIconClick(this.params.data);
    }
    // 🏛️ 2. Legacy Way (Dynamic Dictionary Check)
    else if (
      typeof this.customParams?.handler?.['gotoDashcam'] === 'function'
    ) {
      this.customParams.handler['gotoDashcam'](
        item.media_id,
        this.params.data.id,
      );
    }
  }
}
