// media-viewer.component.ts
import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-container">
     <div class="toolbar">
    @if (allowZoom()) {
      <button class="toggle-button" (click)="zoomIn()"><i class="fas fa-plus"></i></button>
      <button class="toggle-button" (click)="zoomOut()"><i class="fas fa-minus"></i></button>
    }

    @if (allowRotate()) {
      <button class="toggle-button" (click)="rotate()"><i class="fas fa-rotate-right"></i></button>
    }

    @if (allowReset()) {
      <button class="toggle-button" (click)="reset()"><i class="fas fa-undo"></i></button>
    }
    
    @if (allowDownload()) {
      <button class="toggle-button download-btn" (click)="downloadFile()" [disabled]="!url()">
        <i class="fas fa-download"></i>
        <span class="btn-text">Download</span>
      </button>
    }
  </div>
      <div class="viewer-window">
        @if (isPdf()) {
           <iframe [src]="url()" width="100%" height="500px"></iframe>
        } @else if (url()) {
           <img [src]="url()" [style.transform]="transformStyle()" class="img-fluid" />
        } @else {
           <div class="placeholder">No Document Selected</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .media-container { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #f8f9fa; height: 100%; }
    .toolbar { background: #eee; padding: 5px; display: flex; gap: 10px; justify-content: end; }
    .viewer-window { overflow: auto; display: flex; align-items: center; justify-content: center; min-height: 300px; height: 100%; }
    img { transition: transform 0.3s ease; max-height: 60vh; }
    .placeholder { color: #999; font-style: italic; }
    .marker-toggle-container {
 display: flex;
    gap: 10px;
    padding: 8px;
    background: white;
    user-select: none;
    --pegman-scaleX: 1;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
    border-radius: 4px;
    height: 40px;
}

.toggle-button {
  display: flex;
    align-items: center;
    gap: 5px;
    padding: -1px;
    border: 1px solid #ccc;
    border-radius: 15px;
    background-color: #fff;
    cursor: pointer;
    opacity: 0.8;
    color: blue;
    transition: all 0.2s ease-in-out;

  &.active {
    opacity: 1;
    border-color: #007bff;
    background-color: #e7f3ff;
  }
}

.toggle-icon {
//   width: 16px;
  height: 16px;
}

  `]
})
export class MediaViewerComponent {
 url = input<string | null | undefined>(null);
  
  // Computed for safety
//   isPdf = computed(() => this.url()?.toLowerCase().endsWith('.pdf') ?? false);
  
// ✅ Feature Toggle Inputs (Signals)
// ✅ Ye confirm karein ki ye lines wahan hain
  allowZoom = input<boolean>(true);
  allowRotate = input<boolean>(true);
  allowDownload = input<boolean>(true);
  allowReset = input<boolean>(true);

  // States
  scale = signal(1);
  rotation = signal(0);

  // Computeds
  isPdf = computed(() => this.url()?.toLowerCase().endsWith('.pdf') ?? false);
  transformStyle = computed(() => `scale(${this.scale()}) rotate(${this.rotation()}deg)`);

  // Methods
  zoomIn() { if(this.allowZoom()) this.scale.update(s => s + 0.2); }
  zoomOut() { if(this.allowZoom()) this.scale.update(s => Math.max(0.2, s - 0.2)); }
  rotate() { if(this.allowRotate()) this.rotation.update(r => r + 90); }
  reset() { this.scale.set(1); this.rotation.set(0); }

    // ✅ Download Functionality
 async downloadFile() {
  const fileUrl = this.url();
  if (!this.allowDownload() || !fileUrl) return;

  try {
    // 1. File ko fetch karein as a Blob
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // 2. Blob ke liye ek local URL banayein
    const blobUrl = window.URL.createObjectURL(blob);

    // 3. Download link create karein
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Filename extract karein ya default de dein
    const fileName = fileUrl.split('/').pop()?.split('?')[0] || 'document';
    link.download = fileName;

    // 4. Trigger download
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: Agar fetch fail ho jaye (CORS issue), toh naye tab mein open kar dein
    window.open(fileUrl, '_blank');
  }
}
}