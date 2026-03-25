export interface GeofenceData {
  Radius: number; // in kilometers
  Geofence?: string; // comma-separated lat,lng pairs in parentheses
  name?: string;
  position: google.maps.LatLngLiteral; // ✅ MANDATORY: Circle ke liye position
}
export interface MarkerData {
  position: google.maps.LatLngLiteral;
  title: string;
  markerType: 'tracking' | 'alert' | 'customer';
  isStart?: boolean;
  isEnd?: boolean;
  params?: Record<string, any>;
  icon?: {
    url?: string;
    labelOrigin?: google.maps.Point;
    scaledSize?: google.maps.Size;
  };
  label?: google.maps.MarkerLabel;
}
export interface CustomerMarkerData extends MarkerData {
  markerType: 'customer';
  geofence?: GeofenceData;
}

export interface ProcessedGeofence {
  id: string;
  type: 'circle' | 'polygon';
  center?: google.maps.LatLngLiteral;
  radius?: number; // in meters
  paths?: google.maps.LatLngLiteral[];
  options: google.maps.CircleOptions | google.maps.PolygonOptions;
  name?: string;
}

// ==================== CONSTANTS ====================
export const GEOFENCE_CONFIG = {
  CIRCLE: {
    STROKE_COLOR: '#FF6B6B',
    STROKE_OPACITY: 0.8,
    STROKE_WEIGHT: 2,
    FILL_COLOR: '#FF6B6B',
    FILL_OPACITY: 0.2
  },
  POLYGON: {
    STROKE_COLOR: '#4ECDC4',
    STROKE_OPACITY: 0.8,
    STROKE_WEIGHT: 2,
    FILL_COLOR: '#4ECDC4',
    FILL_OPACITY: 0.2
  },
  KM_TO_METERS: 1000,
  DEFAULT_RADIUS: 0.2 // Default 200 meters
} as const;

// ==================== UPDATED GEOFENCE SERVICE ====================
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {
  private geofences = signal<ProcessedGeofence[]>([]);
  private hiddenGeofences = signal<Set<string>>(new Set());

  readonly visibleGeofences = computed(() => {
    const hidden = this.hiddenGeofences();
    return this.geofences().filter(g => !hidden.has(g.id));
  });

  /**
   * Parse geofence string into coordinate array
   * Input: "(22.879595, 75.960754),(22.879600, 75.961344)"
   * Output: [{lat: 22.879595, lng: 75.960754}, ...]
   */
  private parseGeofenceString(geofenceStr: string): google.maps.LatLngLiteral[] | null {
    try {
      const coordPairs = geofenceStr
        .trim()
        .replace(/\s+/g, '')
        .split('),(')
        .map(pair => pair.replace(/[()]/g, ''));

      const coordinates = coordPairs.map(pair => {
        const [lat, lng] = pair.split(',').map(Number);
        
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error(`Invalid coordinate: ${pair}`);
        }

        return { lat, lng };
      });

      if (coordinates.length < 3) {
    
        return null;
      }

      return coordinates;
    } catch (error) {
    
      return null;
    }
  }

  /**
   * Process customer markers and extract geofence data
   */
 processGeofences(customerMarkers: CustomerMarkerData[]): void {
    
    const processedGeofences: ProcessedGeofence[] = [];

    customerMarkers.forEach((marker, index) => {
      
      const geofence = this.createGeofence(marker, index);
      if (geofence) {
        processedGeofences.push(geofence);
      } else {
      }
    });

    this.geofences.set(processedGeofences);
  }

  private createGeofence(
    marker: CustomerMarkerData, 
    index: number
  ): ProcessedGeofence | null {


    const id = `geofence-${index}-${Date.now()}`;
    const name = marker.title;

    // ✅ DECISION POINT 1: Does geofence property exist?
    if (!marker.geofence) {
      return null;
    }

    const { geofence } = marker;

    // ✅ DECISION POINT 2: Is Geofence string provided? → POLYGON
    if (geofence.Geofence && geofence.Geofence.trim() !== '') {
      return this.createPolygonGeofence(id, name, geofence.Geofence);
    }

    
    if (!geofence.position) {
      return null;
    }

    if (!this.isValidPosition(geofence.position)) {
      return null;
    }

    const radius = geofence.Radius || 0.2;
   
    return this.createCircleGeofence(id, name, geofence.position, radius);
  }

  /**
   * Validate position coordinates
   */
  private isValidPosition(position: google.maps.LatLngLiteral): boolean {
    if (!position || typeof position.lat !== 'number' || typeof position.lng !== 'number') {
      return false;
    }

    // Latitude: -90 to 90
    if (position.lat < -90 || position.lat > 90) {
      return false;
    }

    // Longitude: -180 to 180
    if (position.lng < -180 || position.lng > 180) {
      return false;
    }

    return true;
  }

  /**
   * Create circle geofence
   */
   private createCircleGeofence(
    id: string,
    name: string,
    center: google.maps.LatLngLiteral,
    radiusKm: number
  ): ProcessedGeofence {
    const radiusMeters = radiusKm * 1000;
    
    
    
    return {
      id,
      type: 'circle',
      center,
      radius: radiusMeters,
      name,
      options: {
        strokeColor: 'yellow',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'yellow',
        fillOpacity: 0.2,
        clickable: true,
zIndex: 100 // ⬅️ Added this
      }
    };
  }

  /**
   * Create polygon geofence
   */
   private createPolygonGeofence(id: string, name: string, geofenceStr: string): ProcessedGeofence | null {
    const paths = this.parseGeofenceString(geofenceStr);
    
    if (!paths) {
     
      return null;
    }


    
    return {
      id,
      type: 'polygon',
      paths,
      name,
      options: {
        strokeColor: 'yellow',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'yellow',
        fillOpacity: 0.2,
        clickable: true,
        zIndex:100

      }
    };
  }

  /**
   * Toggle geofence visibility
   */
  toggleGeofence(id: string): void {
    const hidden = new Set(this.hiddenGeofences());
    
    if (hidden.has(id)) {
      hidden.delete(id);
    } else {
      hidden.add(id);
    }
    
    this.hiddenGeofences.set(hidden);
  }

  /**
   * Toggle all geofences
   */
  toggleAllGeofences(show: boolean): void {
    if (show) {
      this.hiddenGeofences.set(new Set());
    } else {
      const allIds = new Set(this.geofences().map(g => g.id));
      this.hiddenGeofences.set(allIds);
    }
  }

  /**
   * Clear all geofences
   */
  clearGeofences(): void {
    this.geofences.set([]);
    this.hiddenGeofences.set(new Set());
  }

  /**
   * Get geofence statistics
   */
  getStats() {
    const all = this.geofences();
    return {
      total: all.length,
      circles: all.filter(g => g.type === 'circle').length,
      polygons: all.filter(g => g.type === 'polygon').length,
      visible: this.visibleGeofences().length
    };
  }
}