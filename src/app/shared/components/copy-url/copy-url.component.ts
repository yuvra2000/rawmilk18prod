import { Component, EventEmitter, Output, ChangeDetectionStrategy, signal, computed, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert.service';
// import { AlertService } from 'path-to-your/alert.service'; // Adjust path

// Interface for the component's internal state
interface CopyState {
  isLoading: boolean;
  isCopied: boolean;
}

@Component({
  selector: 'app-copy-url',
  standalone: true,
  imports: [CommonModule, NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './copy-url.component.html',
  styleUrls: ['./copy-url.component.scss']
})
export class CopyUrlComponent {
  // --- Configuration Inputs (Signal-based) ---
  url = input<string>('');
  label = input<string>('');
  placeholder = input<string>('No URL available');
  showShareButton = input<boolean>(false);
  showOpenButton = input<boolean>(false);

  // --- Tooltip Inputs ---
  copyTooltip = input<string>('Copy to clipboard');
  copiedTooltip = input<string>('Copied!');
  copyingTooltip = input<string>('Copying...');

  // --- Outputs ---
  @Output() copied = new EventEmitter<string>();
  @Output() shared = new EventEmitter<string>();
  @Output() opened = new EventEmitter<string>();

  // --- Internal State Management ---
  private state = signal<CopyState>({ isLoading: false, isCopied: false });

  // --- Public Computed Signals for the Template ---
  readonly isLoading = computed(() => this.state().isLoading);
  readonly isCopied = computed(() => this.state().isCopied);
  readonly tooltipText = computed(() => {
    if (this.isLoading()) return this.copyingTooltip();
    if (this.isCopied()) return this.copiedTooltip();
    return this.copyTooltip();
  });

  // In a real app, inject your alert service
  private alert = inject(AlertService);

  async copyToClipboard(): Promise<void> {
    const url = this.url();
    if (!url || this.isLoading()) return;

    this.state.update(s => ({ ...s, isLoading: true }));

    try {
      await navigator.clipboard.writeText(url);
      this.showSuccess();
      this.copied.emit(url);
    } catch (error) {
      // Fallback for older browsers or insecure contexts
      await this.fallbackCopy(url);
    }
  }

  private async fallbackCopy(textToCopy: string): Promise<void> {
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    // ... (styling for the textarea to be offscreen)
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      this.showSuccess();
      this.copied.emit(textToCopy);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      // this.alert.error('Failed to copy link.');
    } finally {
      this.state.update(s => ({ ...s, isLoading: false }));
      document.body.removeChild(textArea);
    }
  }

  shareUrl(): void {
    const url = this.url();
    if (navigator.share) {
      navigator.share({ title: 'Shared Link', url });
    } else {
      // Fallback for browsers without Web Share API
      this.copyToClipboard();
    }
    this.shared.emit(url);
  }

  openUrl(): void {
    const url = this.url();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      this.opened.emit(url);
    }
  }

  private showSuccess(): void {
    this.state.set({ isLoading: false, isCopied: true });
    
    // Reset the "Copied!" state after 2 seconds
    setTimeout(() => {
      this.state.update(s => ({ ...s, isCopied: false }));
    }, 2000);
  }
}