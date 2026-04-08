import { Injectable } from '@angular/core';
import { isVehicleInactive } from './constants/tracking.constants';

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
@Injectable({ providedIn: 'root' })
export class MarkerConfigService {
  public getMarkerConfig(marker: MarkerData, vehicleStatus: string = '') {
    switch (marker.markerType) {
      case 'tracking':
        return this.getTrackingConfig(marker, vehicleStatus);
      case 'alert':
        return {
          icon: 'assets/imagesnew/icons-flag-big.png',
          category: 'alert',
          zIndex: 1,
        };
      // return { icon: '../.ategory: 'alert', zIndex: 1 };
      case 'customer':
        return { icon: null, category: 'customer', zIndex: 1 };
      default:
        return { icon: null, category: 'default', zIndex: 1 };
    }
  }

  private getTrackingConfig(marker: MarkerData, vehicleStatus: string) {
    // 1. Start Marker (Always Static)
    if (marker.isStart) {
      return {
        icon: 'assets/imagesnew/start_marker.png',
        category: 'static',
        zIndex: 100,
      };
    }

    // 2. End Marker Logic (Modified)
    if (marker.isEnd) {
      // ✅ Check if vehicle is Inactive (Stopped/Completed/NoData etc.)
      // Only show Stop Marker if the trip is actually considered "Stopped"

      if (isVehicleInactive(vehicleStatus)) {
        return {
          icon: 'assets/imagesnew/stop_marker.png',
          category: 'static',
          zIndex: 100,
        };
      }
      // 🚀 If status is Active/Running, do NOT return here.
      // Let it fall through to getSpeedBasedConfig to show a running dot (Green/Yellow).
    }

    // 3. Speed Based Logic (For intermediate points OR End point if running)
    // Checking both common keys for speed just in case
    const speed =
      marker.params?.['speed'] ?? marker.params?.['speed(Km/hr)'] ?? 0;
    return this.getSpeedBasedConfig(speed);
  }

  private getSpeedBasedConfig(speed: number) {
    if (speed > 20)
      return {
        icon: 'assets/imagesnew/green_Marker1.png',
        category: 'green',
        zIndex: 100,
      };
    if (speed > 5)
      return {
        icon: 'assets/imagesnew/yellow_Marker1.png',
        category: 'yellow',
        zIndex: 100,
      };
    return {
      icon: 'assets/imagesnew/red_Marker1.png',
      category: 'red',
      zIndex: 100,
    };
  }
}
