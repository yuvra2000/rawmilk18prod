
import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, ColDef } from 'ag-grid-community';
import { ImageConfig } from './interfaces';
import { CELL_RENDERER_BASE_CONFIG } from './utils';


export interface IImageCellRendererParams extends ICellRendererParams {
  colDef: ColDef & {
    cellRendererParams?: ImageConfig;
  }
}

@Component({
  selector: 'app-image-cell-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-cell">
      @if (imageUrl()) {
        <div class="image-container" (click)="onImageClick()">
          <img 
            [src]="imageUrl()" 
            [alt]="config().altText || 'Image'" 
            [style.max-width.px]="config().maxWidth || 40"
            [style.max-height.px]="config().maxHeight || 30"
            class="cell-image" 
            (error)="onImageError()"
            [title]="imageUrl()"
          />
          @if (config().showViewIcon !== false) {
            <div class="image-overlay">
              <i class="material-icons">visibility</i>
            </div>
          }
        </div>
      } @else {
        <div class="no-image-placeholder">
          <i class="material-icons">image</i>
          <span>{{ config().noImageText || 'No Image' }}</span>
        </div>
      }
    </div>
  `,
  styleUrl: './styles/image-cell-renderer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCellRenderer implements ICellRendererAngularComp {
  // Use the new, stronger type for the signal
  private params = signal<IImageCellRendererParams | null>(null);
  
  imageUrl = signal<string>('');

  // The computed signal now has better type inference
  readonly config = computed(() => this.params()?.colDef?.cellRendererParams || {});

  agInit(params: IImageCellRendererParams): void {
    this.params.set(params);
    this.imageUrl.set(params.value || '');
  }

  refresh(params: IImageCellRendererParams): boolean {
    this.params.set(params);
    this.imageUrl.set(params.value || '');
    return true;
  }

  onImageClick(): void {
    const url = this.imageUrl();
    const data = this.params()?.data;
    const onClick = this.config().onImageClick;
    
    if (url && data && onClick) {
      onClick(data, url);
    } else if (url) {
      window.open(url, '_blank');
    }
  }

  onImageError(): void {
    // This logic is already perfect
    this.imageUrl.set('');
  }
}