import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  input,
  signal,
  model,
  output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="upload-container">

      <input #fileInput type="file" 
             [disabled]="disabled()"
             [accept]="accept()" [multiple]="multiple()"
             (change)="onFileSelect($event)" hidden />

      @if (uploadMode() === 'image') {
        <div class="preview-wrapper"
             role="button" tabindex="0"
             (click)="!isDisabled() && fileInput.click()"
             (keydown.enter)="!isDisabled() && fileInput.click()">
             
          @if (previewSrc(); as url) {
            <img [src]="url" class="preview-image" alt="Preview" loading="lazy" />
            <button class="view-file-btn" type="button" aria-label="View image"
                    (click)="$event.stopPropagation(); openPreview(url)">
              <i class="material-icons">visibility</i>
            </button>
          } @else {
            <div class="placeholder">
              <i class="material-icons">{{ getPlaceholderIcon() }}</i>
              <span>{{ uploadText() }}</span>
            </div>
          }
          
          @if (previewSrc() && !isDisabled()) {
            <div class="overlay">
              <button class="btn-change" type="button" aria-label="Change file">
                <i class="material-icons">photo_camera</i>
              </button>
            </div>
          }
        </div>
      } 
      
      @else {
        <div class="file-select-box position-relative"
             [class.disabled-box]="isDisabled()"
             (click)="!isDisabled() && fileInput.click()">
          @if(!serverUrl()&&localFiles().length==0){
 <i class="material-icons">{{ getPlaceholderIcon() }}</i>
          <span style="font-size: 14px;">{{ uploadText() }}</span>
          }
         
          
          @if (serverUrl(); as url) {
             <div class="file-list position-relative" style="background: transparent; right:0px; width:100%">
               <div class="file-item d-flex p-0" style="background-color: transparent;">
                  <div class="d-flex align-items-center" style="width: 60%;">
                    <i class="material-icons">{{ getIconForFile(url) }}</i>
                    <span class="text-truncate" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                      {{ getFileNameFromUrl(url) }}
                    </span>
                  </div>
                  <!-- <div class="success-msg">
                    <i style="color: green;" class="material-icons">check_circle</i>
                  </div> -->
                  <button class="btn-view-file position-absolute" style=" right:0px" type="button"
                       (click)="$event.stopPropagation(); openPreview(url)">
                 <i style="color:#3b82f6" class="material-icons">visibility</i>
               </button>
               </div>
               <!-- <button class="btn-view-file position-absolute" style="bottom:-25px; right:0px" type="button"
                       (click)="$event.stopPropagation(); openPreview(url)">
                 <i class="material-icons">visibility</i>
               </button> -->
            </div>
          }
          
          @else if (localFiles().length > 0) {
            <div class="file-list position-relative" style="background: transparent; right:0px;width:100%">
              @for (file of localFiles(); track file.name) {
                <div class="file-item d-flex p-0" style="background-color: transparent;">
                  <div class="d-flex align-items-center" style="width: 60%;">
                    <i class="material-icons">{{ getIconForFile(file.name) }}</i>
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ file.name }}</span>
                  </div>
                  
                  @if ((getFileProgress(file) ?? 0) < 100) {
                    <div class="progress-container">
                      <div class="progress-bar" [style.width.%]="getFileProgress(file)"></div>
                      <span>{{ getFileProgress(file) }}%</span>
                    </div>
                  } @else {
                    <!-- <div class="success-msg">
                      <i style="color: green;" class="material-icons">check_circle</i>
                    </div> -->
                          <button class="btn-view-file position-absolute" style=" right:0px" type="button"
                       (click)="$event.stopPropagation(); openPreview(file)">
                 <i style="color:#3b82f6" class="material-icons">visibility</i>
               </button>
                  }
                </div>
                <!-- <button class="btn-view-file position-absolute" style="bottom:-25px; right:0px" type="button"
                        (click)="$event.stopPropagation(); openPreview(file)">
                  <i class="material-icons">visibility</i>
                </button> -->
              }
            </div>
          } 
        </div>
        
        @if (localFiles().length > 1) {
           <div class="file-list">
            @for (file of localFiles(); track file.name) {
              <div class="file-item">
                <i class="material-icons">{{ getIconForFile(file.name) }}</i>
                <span>{{ file.name }}</span>
              </div>
            }
          </div>
        }
      }

      @if (errorMessage(); as msg) {
        <div class="error-message">
          <small class="text-danger">{{ msg }}</small>
        </div>
      }
    </div>
  `,
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnDestroy {
  // ✅ PURE MODEL (Optimized)
  value = model<string | File | File[] | null>(null);

  // Inputs
  accept = input<string>('image/*');
  multiple = input<boolean>(false);
  uploadText = input<string>('Add Photo');
  maxFileSize = input<number>(5242880);
  uploadMode = input<'image' | 'file' | any>('image');
  disabled = input<boolean>(false);

  // Outputs (Modern + Legacy)
  uploadError = output<string>();
  
  // Internal State
  localImagePreview = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  fileProgressMap = signal<Map<File, number>>(new Map());

  // ✅ PURE COMPUTED SIGNALS
  serverUrl = computed(() => {
    const val = this.value();
    return (typeof val === 'string' && val) ? val : null;
  });

  localFiles = computed((): File[] => {
    const val = this.value();
    if (val instanceof File) return [val];
    if (Array.isArray(val) && val.every(f => f instanceof File)) return val;
    return [];
  });

  previewSrc = computed(() => this.serverUrl() || this.localImagePreview());
  isDisabled = computed(() => this.disabled());

  private objectUrlMap = new Map<File, string>();

  constructor() {}

  ngOnDestroy(): void {
    this.objectUrlMap.forEach(url => URL.revokeObjectURL(url));
    this.objectUrlMap.clear();
  }

  // ✅ LOGIC HANDLER
  onFileSelect(event: Event): void {
    if (this.isDisabled()) return;
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.files?.length) return;

    this.errorMessage.set(null);
    const files = Array.from(inputEl.files);
    
    if (this.validateFiles(files)) {
        
        // A. Image Preview Handling
        if (this.uploadMode() === 'image') 
          this.generateImagePreview(files[0]);
        else
          this.localImagePreview.set(null);

        // B. Progress Handling
        if (this.uploadMode() === 'file') 
          this.startFileProgress(files);

        // C. Update Model (Sync)
        const newValue = this.multiple() ? files : files[0];
        this.value.set(newValue);
    }
    inputEl.value = '';
  }

  private generateImagePreview(file: File): void {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => this.localImagePreview.set(e.target?.result as string);
    reader.onerror = () => this.setError('Failed to read file');
    reader.readAsDataURL(file);
  }

  // ✅ OPTIMIZED PROGRESS (No RxJS, No RAF Bombardment)
  private startFileProgress(files: File[]): void {
    // 1. Init Map with 0
    this.fileProgressMap.update(currentMap => {
      const newMap = new Map(currentMap);
      files.forEach(f => newMap.set(f, 0));
      return newMap;
    });

    let progress = 0;

    // 2. Simple Interval
    const intervalId = setInterval(() => {
      progress += 20; // Fast simulation

      this.fileProgressMap.update(currentMap => {
        const newMap = new Map(currentMap);
        files.forEach(f => {
           const currentVal = newMap.get(f) || 0;
           if (currentVal < 100) {
             newMap.set(f, Math.min(100, progress));
           }
        });
        return newMap;
      });

      if (progress >= 100) {
        clearInterval(intervalId);
      }
    }, 150);
  }

  getFileProgress(file: File): number | null {
    return this.fileProgressMap().get(file) ?? null;
  }

  // --- Helpers ---
  getFileNameFromUrl(url: string | null): string {
    if (!url) return 'Existing File';
    try {
      return decodeURIComponent(url).split('/').pop()?.split('?')[0] || 'Existing File';
    } catch (e) {
      return 'Existing File';
    }
  }

  openPreview(fileOrUrl: File | string): void {
    let url: string;
    if (typeof fileOrUrl === 'string') {
      url = fileOrUrl;
    } else {
      let existingUrl = this.objectUrlMap.get(fileOrUrl);
      if (!existingUrl) {
        existingUrl = URL.createObjectURL(fileOrUrl);
        this.objectUrlMap.set(fileOrUrl, existingUrl);
      }
      url = existingUrl;
    }
    window.open(url, '_blank');
  }

  private validateFiles(files: File[]): boolean {
    for (const file of files) {
      if (file.size > this.maxFileSize()) {
        this.setError(`File size must be ≤ ${this.formatFileSize(this.maxFileSize())}`);
        return false;
      }
      if (!this.isAcceptedType(file)) {
        this.setError('File type not allowed');
        return false;
      }
    }
    return true;
  }

  private isAcceptedType(file: File): boolean {
    const accepted = this.accept().split(',').map(a => a.trim().toLowerCase());
    if (accepted.includes('*/*')) return true;
    if (accepted.includes('image/*') && file.type.startsWith('image/')) return true;
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    return accepted.some(entry => file.type.toLowerCase() === entry || ext === entry);
  }

  private setError(message: string): void {
    this.errorMessage.set(message);
    this.uploadError.emit(message);
  }

  getPlaceholderIcon(): string {
    return this.accept().includes('image/*') ? 'add_a_photo' : 'upload_file';
  }

  getIconForFile(input: string): string {
    const filename = input.split('?')[0]; 
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    switch (ext) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc': case 'docx': return 'description';
      case 'xls': case 'xlsx': return 'table_chart';
      case 'jpg': case 'jpeg': case 'png': return 'image';
      default: return 'insert_drive_file';
    }
  }

  private formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}