import { Injectable, signal, inject, OnDestroy, NgZone, computed } from '@angular/core';
import {
  timer,
  Subscription,
  switchMap,
  catchError,
  of,
  map,
  takeWhile,
} from 'rxjs';
import { commonService } from '../../../services/common.service';
import { isVehicleInactive } from '../shared/constants/tracking.constants';

export interface VehiclePosition {
  vehicleId: string;
  lat: number;
  lng: number;
  position: google.maps.LatLngLiteral;
  heading: number;
  speed: number;
  status: string;
  lastUpdate: string;
  markerInstance?: google.maps.Marker;

}

@Injectable({
  providedIn: 'root',
})
export class LiveTrackingService implements OnDestroy {
  private apiService = inject(commonService);
  private ngZone = inject(NgZone);

  private mapInstance: google.maps.Map | null = null;
  private isTracking = signal<boolean>(false);
  private currentPayloadSignature = '';

  // ✅ Stores last payload to enable toggling without passing args
  private lastPayload: any = null;
//  private readonly INVALID_STATUSES = ['Completed', 'NonGPS', 'NoData', 'Breakdown'];
  // ✅ Public Read-only Signal for UI Buttons
  readonly isTrackingActive = computed(() => {
    const active = this.isTracking();
    console.log('Live Tracking Active:', active);
    return active;
  });

  private vehiclesMap = new Map<
    string,
    {
      marker: google.maps.Marker;
      polyline: google.maps.Polyline;
      lastLat: number;
      lastLng: number;
      heading: number;
      lastStatus: string;
    }
  >();

  readonly activeVehicles = signal<VehiclePosition[]>([]);

  private pollingSubscription: Subscription | null = null;
  private readonly POLLING_INTERVAL = 10000;
  // ✅ Stores last payload to enable toggling without passing args
 
  
  // ✅ Flag for First Time Zoom
  private hasInitialZoomDone = false;
  constructor() {}

  setMapInstance(map: google.maps.Map) {
    this.mapInstance = map;
  }

  startTracking(payload: any) {
    this.lastPayload = payload;
   console.log("Starting live tracking with payload:",payload);
 // ✅ 1. INITIAL CHECK: Payload me status check karein
    // if (payload.vehicleStatus && this.isInvalidStatus(payload.vehicleStatus)) {
    //     console.warn(`⚠️ Live Tracking Aborted: Vehicle Status is '${payload.vehicleStatus}'`);
    //     this.stopTracking(); // Ensure everything is stopped
    //     return; // Exit immediately
    // }
  
  this.hasInitialZoomDone = false;
    const newSignature = JSON.stringify(payload);
    console.log('Live Tracking Payload Signature:', this.currentPayloadSignature);
    if (this.isTracking() && this.currentPayloadSignature === newSignature)
      return;
    
    // If tracking is active but payload changed, stop previous logic first
    if (this.isTracking()) this.stopTracking();

    console.log('🚀 Starting Live Tracking...');
    this.isTracking.set(true);
    this.currentPayloadSignature = newSignature;

    this.pollingSubscription = timer(0, this.POLLING_INTERVAL)
      .pipe(
        takeWhile(() => this.isTracking()),
        switchMap(() => this.fetchVehicleData(payload))
      )
      .subscribe();
  }
 // ✅ Helper to check invalid statuses
  // private isInvalidStatus(status: string): boolean {
  //     if (!status) return false;
  //     return this.INVALID_STATUSES.includes(status);
  // }
  /**
   * ✅ UPDATED: STOP TRACKING (PAUSE ONLY)
   * यह सिर्फ API और Animation रोकता है। Map से Marker/Polyline नहीं हटाता।
   */
  stopTracking() {
    // if (!this.isTracking()) return;
    console.log('🛑 Stopping Live Tracking (Paused - Keeping Markers)...');
    this.isTracking.set(false);
    this.currentPayloadSignature = '';

    // 1. Stop API Polling
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }

    // 2. Stop Animations Only (Do NOT remove from map)
    this.vehiclesMap.forEach(item => {
        const p: any = item.polyline as any;
        if (p.__animId) {
            cancelAnimationFrame(p.__animId);
            p.__animId = null;
        }
    });
    
    // ⚠️ CRITICAL: We removed 'vehiclesMap.clear()' from here.
    // The markers and polylines will stay on the map.
  }

  /**
   * ✅ NEW: COMPLETE CLEANUP
   * यह सब कुछ हटा देता है। इसे तब कॉल करें जब Component Destroy हो (Modal Close)।
   */
  private clearAllMapObjects() {
    console.log('🧹 Clearing all map objects...');
    this.vehiclesMap.forEach(item => {
        if (item.marker) item.marker.setMap(null);
        if (item.polyline) item.polyline.setMap(null);
        const p: any = item.polyline as any;
        if (p.__animId) cancelAnimationFrame(p.__animId);
    });
    this.vehiclesMap.clear();
    this.activeVehicles.set([]);
  }

  toggleTracking(payload?: any) {
    if (this.isTracking()) {
      this.stopTracking(); // Pause
    } else {
      const p = payload || this.lastPayload;
      if (p) {
        this.startTracking(p); // Resume
      } else {
        console.warn('⚠️ No vehicle data available to start tracking.');
      }
    }
  }

  private fetchVehicleData(payload: any) {
    const formData = new FormData();
    formData.append('portal', 'itraceit');
    formData.append('ImeiNo', payload.ImeiNo);
    if (payload.AccessToken)
      formData.append('AccessToken', payload.AccessToken);

    return this.apiService.liveData(formData).pipe(
      map((response: any) => {
        if (response && response.Status === 'success' && response.Data) {
          this.processVehicleUpdates(response.Data);
        }
        return response;
      }),
      catchError((err) => {
        console.error('API Error:', err);
        return of(null);
      })
    );
  }

  private async processVehicleUpdates(data: any[]) {
    if (!this.mapInstance) return;

    for (const v of data) {
      const status = v.vehicleStatus || v.runningStatus || 'Stopped';
      
      if (isVehicleInactive(status)) {
          console.warn(`🚫 Vehicle ${v.VehicleNo} stopped due to status: ${status}`);
          this.removeVehicleFromMap(v.VehicleNo || v.ImeiNo);
          continue; 
      }

      const parts = v.LatLong.split(',');
      if (parts.length < 2) continue;

      const targetLat = parseFloat(parts[0]);
      const targetLng = parseFloat(parts[1]);
      const vehicleId = v.VehicleNo || v.ImeiNo;

      let vehicleData = this.vehiclesMap.get(vehicleId);

      // --- SCENARIO A: NEW VEHICLE (First Load) ---
      if (!vehicleData) {
        const icon = await this.getVehicleIconByStatus(status, 0);

        const marker = new google.maps.Marker({
          position: { lat: targetLat, lng: targetLng },
          map: this.mapInstance,
          icon: icon,
          title: vehicleId,
          zIndex: 1000,
          optimized: false,
        });

        const polyline = new google.maps.Polyline({
          path: [{ lat: targetLat, lng: targetLng }],
          map: this.mapInstance,
          strokeColor: '#1D4380',
          strokeOpacity: 1.0,
          strokeWeight: 1,
          zIndex: 99,
          icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 1.5, strokeColor: '#1D4380', fillColor: '#1D4380', fillOpacity: 0.5 }, offset: '100%', repeat: '50px' }],
        });

        this.vehiclesMap.set(vehicleId, { 
            marker, 
            polyline, 
            lastLat: targetLat, 
            lastLng: targetLng, 
            heading: 0, 
            lastStatus: status 
        });
        
        // ❌ NO ZOOM HERE: We don't zoom on first load anymore.
        // We wait for movement.
      } 
      // --- SCENARIO B: EXISTING VEHICLE (Update) ---
      else {
        const startLat = vehicleData.lastLat;
        const startLng = vehicleData.lastLng;

        // ✅ Check if Moved
        if (Math.abs(startLat - targetLat) > 0.00001 || Math.abs(startLng - targetLng) > 0.00001) {
          const heading = this.calculateBearing(startLat, startLng, targetLat, targetLng);
          const rotatedIcon = await this.getVehicleIconByStatus(status, heading - 90);
          vehicleData.marker.setIcon(rotatedIcon);

          this.ngZone.runOutsideAngular(() => {
            this.animateMarkerAndLine(vehicleData!.marker, vehicleData!.polyline, { lat: startLat, lng: startLng }, { lat: targetLat, lng: targetLng });
          });

          vehicleData.lastLat = targetLat;
          vehicleData.lastLng = targetLng;
          vehicleData.heading = heading;
          vehicleData.lastStatus = status;

          // ✅ CONDITIONAL ZOOM: Only on Movement & Only Once
          if (!this.hasInitialZoomDone) {
             console.log('📍 Vehicle Moved for the first time! Zooming in...');
             this.mapInstance.setZoom(14);
             this.mapInstance.panTo({ lat: targetLat, lng: targetLng });
             this.hasInitialZoomDone = true; // Mark as done
          } else {
             // If already zoomed once, just follow smoothly (Pan Only)
             this.smoothPanTo({ lat: targetLat, lng: targetLng });
          }
        }
      }
    }
  }

  // Remove vehicle logic
  private removeVehicleFromMap(vehicleId: string) {
      const data = this.vehiclesMap.get(vehicleId);
      if (data) {
          data.marker.setMap(null);
          data.polyline.setMap(null);
          const p: any = data.polyline as any;
          if (p.__animId) cancelAnimationFrame(p.__animId);
          this.vehiclesMap.delete(vehicleId);
      }
  }
  // ✅ YOUR OPTIMIZED ANIMATION LOGIC (STEPS=5, Pre-computed)
  private animateMarkerAndLine(
    marker: google.maps.Marker,
    polyline: google.maps.Polyline,
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral
  ) {
    const p: any = polyline as any;
    const STEPS = 5;

    if (p.__animId) {
      cancelAnimationFrame(p.__animId);
      p.__animId = null;
    }

    const duration = this.POLLING_INTERVAL;
    const startTime = performance.now();

    const subpoints: google.maps.LatLng[] = [];
    for (let i = 1; i <= STEPS; i++) {
      const frac = i / STEPS;
      const lat = start.lat + (end.lat - start.lat) * frac;
      const lng = start.lng + (end.lng - start.lng) * frac;
      subpoints.push(new google.maps.LatLng(lat, lng));
    }

    const path = polyline.getPath();
    if (path.getLength() === 0) {
      path.push(new google.maps.LatLng(start.lat, start.lng));
    }

    if (typeof p.__lastPushedIndex === 'undefined' || p.__lastPushedIndex === null) {
      p.__lastPushedIndex = 0;
    }

    let lastPushedIndex = p.__lastPushedIndex;

    const animate = (currentTime: number) => {
      if (!this.isTracking()) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentLat = start.lat + (end.lat - start.lat) * progress;
      const currentLng = start.lng + (end.lng - start.lng) * progress;
      const newPos = new google.maps.LatLng(currentLat, currentLng);
      marker.setPosition(newPos);

      const thresholdIndex = Math.floor(progress * STEPS);

      while (lastPushedIndex < thresholdIndex) {
        if (lastPushedIndex < subpoints.length) {
            const pointToPush = subpoints[lastPushedIndex];
            const lastPathPoint = path.getAt(path.getLength() - 1);
            if (!lastPathPoint || Math.abs(lastPathPoint.lat() - pointToPush.lat()) > 0.000001 || Math.abs(lastPathPoint.lng() - pointToPush.lng()) > 0.000001) {
                path.push(pointToPush);
            }
        }
        lastPushedIndex++;
      }

      if (progress < 1) {
        p.__animId = requestAnimationFrame(animate);
      } else {
        while (lastPushedIndex < STEPS) {
          if (lastPushedIndex < subpoints.length) {
            const pointToPush = subpoints[lastPushedIndex];
            const lastPathPoint = path.getAt(path.getLength() - 1);
            if (!lastPathPoint || Math.abs(lastPathPoint.lat() - pointToPush.lat()) > 0.000001 || Math.abs(lastPathPoint.lng() - pointToPush.lng()) > 0.000001) {
              path.push(pointToPush);
            }
          }
          lastPushedIndex++;
        }

        const finalPos = new google.maps.LatLng(end.lat, end.lng);
        const lastPathPoint = path.getAt(path.getLength() - 1);
        if (!lastPathPoint || Math.abs(lastPathPoint.lat() - finalPos.lat()) > 0.000001 || Math.abs(lastPathPoint.lng() - finalPos.lng()) > 0.000001) {
          path.push(finalPos);
        }

        p.__lastPushedIndex = lastPushedIndex;
        p.__animId = null;
      }
    };

    p.__animId = requestAnimationFrame(animate);
  }

  // --- Helper: Canvas Rotation ---
  // private async getVehicleIconByStatus(
  //   status: string,
  //   angle: number
  // ): Promise<google.maps.Icon> {
  //   const baseUrl = 'assets/imagesnew/kml/vehicle/trucklive.png';
  //   const desiredWidth = 32;
  //   const desiredHeight = 12;

  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.crossOrigin = 'anonymous';
  //     img.src = baseUrl;
  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d');
  //       if (!ctx) return;
  //       const rads = (angle * Math.PI) / 180;
  //       const absCos = Math.abs(Math.cos(rads));
  //       const absSin = Math.abs(Math.sin(rads));
  //       canvas.width = desiredWidth * absCos + desiredHeight * absSin;
  //       canvas.height = desiredWidth * absSin + desiredHeight * absCos;
  //       ctx.translate(canvas.width / 2, canvas.height / 2);
  //       ctx.rotate(rads);
  //       ctx.drawImage(
  //         img,
  //         -desiredWidth / 2,
  //         -desiredHeight / 2,
  //         desiredWidth,
  //         desiredHeight
  //       );
  //       resolve({
  //         url: canvas.toDataURL('image/png'),
  //         anchor: new google.maps.Point(canvas.width / 2, canvas.height / 2),
  //         scaledSize: new google.maps.Size(canvas.width, canvas.height),
  //       });
  //     };
  //     img.onerror = () =>
  //       resolve({ url: baseUrl, scaledSize: new google.maps.Size(32, 12) });
  //   });
  // }

  private calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }
 // ✅ NEW: Smooth Pan Logic (Angular 12 Logic Ported)
  private smoothPanTo(position: google.maps.LatLngLiteral) {
    if (!this.mapInstance) return;

    const currentCenter = this.mapInstance.getCenter();
    if (!currentCenter) return;

    // Use Geometry library if available, else simple fallback
    let distance = 0;
    if (google.maps.geometry && google.maps.geometry.spherical) {
        const posLatLng = new google.maps.LatLng(position.lat, position.lng);
        distance = google.maps.geometry.spherical.computeDistanceBetween(currentCenter, posLatLng);
    } else {
        // Simple distance approximation (Euclidean) if geometry lib missing
        // 1 deg lat approx 111km
        const dx = (position.lat - currentCenter.lat()) * 111000; 
        const dy = (position.lng - currentCenter.lng()) * 111000;
        distance = Math.sqrt(dx*dx + dy*dy);
    }

    // Threshold: 200 meters (as per your request)
    if (distance > 200) {
        // console.log('📍 Vehicle moving out of view, Panning map...');
        this.mapInstance.panTo(position);
    }
  }
    // ✅ UPDATED: Canvas Logic with Color Replacement (Green/Grey/Original)
  private async getVehicleIconByStatus(
    status: string,
    angle: number
  ): Promise<google.maps.Icon> {
    const baseUrl = 'assets/imagesnew/kml/vehicle/trucklive.png';
    const desiredWidth = 32;
    const desiredHeight = 12;

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = baseUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Setup Rotation Dimensions
        const rads = (angle * Math.PI) / 180;
        const absCos = Math.abs(Math.cos(rads));
        const absSin = Math.abs(Math.sin(rads));
        canvas.width = desiredWidth * absCos + desiredHeight * absSin;
        canvas.height = desiredWidth * absSin + desiredHeight * absCos;

        // 2. Draw Image Center & Rotate
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rads);
        ctx.drawImage(
          img,
          -desiredWidth / 2,
          -desiredHeight / 2,
          desiredWidth,
          desiredHeight
        );

        // ✅ 3. Color Replacement Logic (from your Angular 12 code)
        // Extract pixel data to manipulate colors
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let targetColor: [number, number, number] | null = null;
        
        // Status check (Case Insensitive mostly safe)
        const s = status.toLowerCase();
        if (s === 'running' || s === 'active' || s === 'moving') {
            targetColor = [0, 255, 0]; // Green
        } else if (s === 'inactive' || s === 'offline') {
            targetColor = [128, 128, 128]; // Grey
        }
        // 'stopped' or others keep original color (null)

        if (targetColor) {
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                // Simple threshold to detect non-transparent parts (or Red parts if image is red)
                // Assuming original truck is Red-ish as per your code check:
                // if (a > 0 && r > 150 && g < 100 && b < 100)
                
                // Using a slightly more generic check for visible pixels for better coverage
                // or stick to your strict check if the image has other colors you want to keep.
                // Let's use your logic:
                if (a > 0 && r > 100 && g < 100 && b < 100) { 
                    data[i] = targetColor[0];
                    data[i + 1] = targetColor[1];
                    data[i + 2] = targetColor[2];
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        resolve({
          url: canvas.toDataURL('image/png'),
          anchor: new google.maps.Point(canvas.width / 2, canvas.height / 2),
          scaledSize: new google.maps.Size(canvas.width, canvas.height),
        });
      };
      img.onerror = () =>
        resolve({ url: baseUrl, scaledSize: new google.maps.Size(32, 12) });
    });
  }
  ngOnDestroy(): void {
    this.stopTracking();
       this.clearAllMapObjects(); // Remove markers
  }
}
