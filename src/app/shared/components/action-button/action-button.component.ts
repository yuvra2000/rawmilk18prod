import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionButtonData {
  action: string;
  data?: any;
}

export type IconType = 'fa' | 'img' | 'text';

export interface IconConfig {
  type: IconType;
  value: string;
  alt?: string; // For img type
}

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [style.background-color]="customBackgroundColor()"
      [style.color]="customTextColor()"
      (click)="handleClick()"
      [disabled]="disabled()"
    >
      @if (iconConfig()) {
        <span class="icon-container">
          @switch (iconConfig()?.type) {
            @case ('fa') {
              <i [class]="'fa ' + iconConfig()?.value" aria-hidden="true"></i>
            }
            @case ('img') {
              <img
                [src]="iconConfig()?.value"
                [alt]="iconConfig()?.alt || 'Icon'"
                class="icon-img"
              />
            }
            @case ('text') {
              <span class="icon-text">{{ iconConfig()?.value }}</span>
            }
          }
        </span>
      }
      {{ name() }}
    </button>
  `,
  styles: [
    `
      .action-btn {
        border: none;
        border-radius: 4px;
        padding: 6px 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
      }

      .action-btn:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .action-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .action-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .icon-container {
        display: inline-flex;
        align-items: center;
        line-height: 1;
      }

      .icon-text {
        font-size: 16px;
        line-height: 1;
      }

      .icon-img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }

      .fa {
        font-size: 14px;
      }
      /* Custom color support */
      .btn-custom {
        color: white;
      }
    `,
  ],
})
export class ActionButtonComponent {
  // Input signals
  name = input.required<string>();
  color = input<string>('primary');
  icon = input<string | IconConfig>('');
  disabled = input<boolean>(false);
  actionType = input<string>('');
  data = input<any>(null);

  // Output signal
  buttonClick = output<ActionButtonData>();

  // Computed property for icon configuration
  iconConfig = computed(() => {
    const iconValue = this.icon();
    if (!iconValue) return null;

    if (typeof iconValue === 'string') {
      // Legacy support for simple string icons (text type)
      return {
        type: 'text' as IconType,
        value: iconValue,
      };
    }

    return iconValue;
  });

  // Computed property for button classes
  buttonClasses = computed(() => {
    const baseClass = 'action-btn';
    const colorClass = this.getColorClass();
    return `${baseClass} ${colorClass}`;
  });

  // Computed properties for custom colors
  customBackgroundColor = computed(() => {
    const color = this.color();
    const predefinedColors = [
      'primary',
      'success',
      'danger',
      'warning',
      'info',
      'secondary',
      'light',
      'dark',
    ];
    if (!predefinedColors.includes(color) && color.startsWith('#')) {
      return color;
    }
    return '';
  });

  customTextColor = computed(() => {
    const color = this.color();
    const predefinedColors = [
      'primary',
      'success',
      'danger',
      'warning',
      'info',
      'secondary',
      'light',
      'dark',
    ];

    if (!predefinedColors.includes(color) && color.startsWith('#')) {
      // Simple contrast calculation - in production, you might want a more sophisticated approach
      return this.getContrastColor(color);
    }
    return '';
  });

  private getColorClass(): string {
    const color = this.color();
    const predefinedColors = [
      'primary',
      'success',
      'danger',
      'warning',
      'info',
      'secondary',
      'light',
      'dark',
    ];

    if (predefinedColors.includes(color)) {
      return `btn-${color}`;
    }

    return 'btn-custom';
  }

  private getContrastColor(hexColor: string): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  handleClick(): void {
    if (this.disabled()) {
      return;
    }

    const actionData: ActionButtonData = {
      action:
        this.actionType() || this.name().toLowerCase().replace(/\s+/g, '-'),
      data: this.data(),
    };

    this.buttonClick.emit(actionData);
  }
}
