import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PolylineService {
  readonly hiddenMarkerCategories = signal<{ [category: string]: boolean }>({});
  // Store polyline visibility
  showPolyline = signal<boolean>(true);
  showDirectionArrows = signal<boolean>(true);
  // Store the coordinates (path) for polyline
  polylinePath = signal<google.maps.LatLngLiteral[]>([]);

  // Polyline style
  polylineOptions = computed<google.maps.PolylineOptions>(() => {
    const showArrows = this.showDirectionArrows();
    const path = this.polylinePath(); // Direction Arrow configuration

    const arrowIcon = {
      path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      scale: 1.5, // Arrow size
      strokeColor: '#1D4380',
      fillColor: '#1D4380',
      fillOpacity: 0.5,
    };

    return {
      strokeColor: '#1D4380',
      strokeOpacity: 1.0,
      strokeWeight: 1,
      clickable: false, // Arrows तभी दिखाओ जब toggle ON हो और path में कम से कम 2 points हों
      icons:
        showArrows && path.length > 1
          ? [
              {
                icon: arrowIcon, // हर 50 pixels पर arrow repeat करें
                repeat: '50px',
              },
            ]
          : [],
    };
  });

  /**
   * Set or update the path for the polyline.
   */
  readonly bounds = computed(() => {
    const path = this.polylinePath();
    if (!path || path.length === 0) {
      return null; // अगर कोई पाथ नहीं है, तो null लौटाएँ
    }

    // एक नया LatLngBounds ऑब्जेक्ट बनाएँ
    const bounds = new google.maps.LatLngBounds();

    // पाथ के हर पॉइंट को bounds में शामिल करें
    for (const point of path) {
      bounds.extend(point);
    }

    return bounds;
  });
  setPath(path: google.maps.LatLngLiteral[]): void {
    if (Array.isArray(path)) {
      this.polylinePath.set(path);
    }
  }

  /**
   * Append a new coordinate (e.g., for live tracking).
   */
  addPoint(point: google.maps.LatLngLiteral): void {
    const updatedPath = [...this.polylinePath(), point];
    this.polylinePath.set(updatedPath);
  }

  /**
   * Toggle the visibility of the polyline.
   */
  toggle(): void {
    this.showPolyline.update((v) => !v);
  }

  /**
   * Reset everything.
   */
  clear(): void {
    this.polylinePath.set([]);
    // this.showPolyline.set(false);
  }
  /**
   * किसी कैटेगरी की visibility को टॉगल करता है (दिखाता/छिपाता है)।
   */
  toggleCategoryVisibility(category: string): void {
    this.hiddenMarkerCategories.update((current) => {
      const newState = { ...current };
      newState[category] = !current[category]; // स्थिति को उल्टा करें
      return newState;
    });
  }
  toggleDirectionArrows(): void {
    this.showDirectionArrows.update((v) => !v);
  }
}
