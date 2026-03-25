// action-button.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionButtonConfig {
  text?: string;
  icon?: string;
  iconText?: string;
  class?: string;
  action: (context?: any) => void; 
  disabled?: boolean;
  tooltip?: string;
  showOnlyIcon?: boolean;
}

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="config.class"
      (click)="config.action(contextPayload)"
      [disabled]="config.disabled ?? false"
      [title]="config.tooltip || ''"
      style="all:unset; cursor: pointer;"
    >
      @if (config.icon) {
        <i [class]="config.icon">
        </i>
        <span>{{ config.iconText || '' }}</span>
      }
      @if (config.text && !config.showOnlyIcon) {
        <span [class.ms-1]="config.icon">{{ config.text }}</span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {
  @Input({ required: true }) config!: ActionButtonConfig;
  @Input() fieldName?: string;
   @Input() contextPayload?: any; 
}