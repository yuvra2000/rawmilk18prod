import { CommonModule } from '@angular/common';
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-map-info-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-info-content.component.html',
  styleUrl: './map-info-content.component.scss'
})
export class MapInfoContentComponent {
  // ✅ 1. Convert @Input to Signal Input
  // Default value is empty object {}
  params = input<{ [key: string]: any }>({});

  // ✅ 2. Convert getter to Computed Signal
  // This will automatically update whenever 'params' input changes
  entries = computed<{ key: string; value: any }[]>(() => {
    const currentParams = this.params();
    
    if (!currentParams || typeof currentParams !== 'object') return [];
    
    return Object.entries(currentParams)
      // ✅ UPDATED FILTER: Exclude 'title' along with null/undefined values
      .filter(([key, value]) => key !== 'title' && value !== null && value !== undefined)
      .map(([key, value]) => ({ key, value }));
  });

  // ✅ 3. New Computed Signal for Dynamic Table Width
  tableWidth = computed(() => {
    const title = this.params()?.['title'];
    switch (title) {
      case 'Vehicle Details':
        return '400px';
      case 'Customer Point Details':
      case 'Alert Details':
        return '250px';
      default:
        return '400px'; // Default fallback (or 300px/auto as preferred)
    }
  });

  // Helper method remains the same (used in template)
  getLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, c => c.toUpperCase());
  }
}