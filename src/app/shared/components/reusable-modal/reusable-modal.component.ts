import {
  Component,
  input,
  booleanAttribute,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-base-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ✅ Host binding for Escape key (Best Practice)
  host: {
    '(keydown.escape)': 'activeModal.dismiss("escape")',
  },
  template: `
    @if (showHeader()) {
      <div class="modal-header">
        <div class="modal-title-section">
          <h4 class="modal-title">{{ title() }}</h4>
          @if (subtitle()) {
            <p class="modal-subtitle">{{ subtitle() }}</p>
          }
        </div>

        @if (showCloseButton()) {
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            (click)="activeModal.dismiss('close')"
          >
            <i class="material-icons">close</i>
          </button>
        }
      </div>
    }

    <div class="modal-body" [class]="bodyClass()" [style.height]="bodyHeight()">
      <ng-content></ng-content>
    </div>

    @if (showFooter()) {
      <div class="modal-footer">
        <ng-content select="[slot=footer]"></ng-content>

        @if (!hasCustomFooter()) {
          <div class="default-footer d-flex gap-2">
            @if (showCancelButton()) {
              <button
                type="button"
                [class]="
                  cancelButtonClass() + ' d-flex align-items-center gap-2'
                "
                (click)="activeModal.dismiss('cancel')"
              >
                <!-- <i class="material-icons">cancel</i>
                {{ cancelText() }} -->
                @if (cancelIcon()) {
                  <i class="material-icons">{{ cancelIcon() }}</i>
                }
                <span>{{ cancelText() }}</span>
              </button>
            }
            @if (showSaveButton()) {
              <button
                type="button"
                [class]="saveButtonClass() + ' d-flex align-items-center gap-2'"
                class="btn  d-flex align-items-center gap-2"
                (click)="handleSaveClick()"
              >
                @if (isSaving()) {
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ savingText() }}
                } @else {
                  <!-- <i class="material-icons">{{ saveIcon() }}</i>
                  {{ saveText() }} -->
                  @if (saveIcon()) {
                    <i class="material-icons">{{ saveIcon() }}</i>
                  }
                  <span>{{ saveText() }}</span>
                }
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  styleUrl: './reusable-modal.component.scss',
})
export class ReusableModalComponent {
  readonly activeModal = inject(NgbActiveModal);

  // === Inputs (Data) ===
  title = input('');
  subtitle = input('');
  bodyClass = input('');
  bodyHeight = input('');

  // === Inputs (Controls) ===
  showHeader = input(true, { transform: booleanAttribute });
  showCloseButton = input(true, { transform: booleanAttribute });
  showFooter = input(false, { transform: booleanAttribute });
  hasCustomFooter = input(false, { transform: booleanAttribute }); // Manual override

  showCancelButton = input(true, { transform: booleanAttribute });
  showSaveButton = input(true, { transform: booleanAttribute });

  // === Text & State ===
  cancelText = input('Cancel');
  saveText = input('Save');
  savingText = input('Saving...');
  saveIcon = input('save');
  cancelIcon = input<string>('cancel');
  // ✅ New Inputs with defaults acting as safety nets
  saveButtonClass = input<string>('btn reusable-save-btn');
  cancelButtonClass = input<string>('btn reusable-close-btn');
  saveDisabled = input(false, { transform: booleanAttribute });

  // ⚠️ Important: Parent ko khud true/false bhejna padega
  isSaving = input(false, { transform: booleanAttribute });
  private internalLoading = signal(false);

  // Computed: Combine both loading states (Parent's OR Internal)
  effectiveLoading = computed(() => this.isSaving() || this.internalLoading());

  // === Outputs ===
  // ✅ Grok Style: Just emit event, let Parent handle async/logic
  onSaveAction = input<(() => Promise<void> | void) | undefined>(undefined);
  async handleSaveClick(): Promise<void> {
    // 1. Get the function from the signal
    const actionFn = this.onSaveAction();

    if (actionFn) {
      // ✅ Logic: Agar function diya hai, to Promise resolve karo aur Spinner dikhao
      this.internalLoading.set(true);
      try {
        await actionFn();
      } catch (error) {
        console.error(error);
      } finally {
        this.internalLoading.set(false);
      }
    } else {
      // ✅ Logic: Agar function nahi hai, to bas Close kar do (Old default behavior)
      this.activeModal.close('save');
    }
  }
}
