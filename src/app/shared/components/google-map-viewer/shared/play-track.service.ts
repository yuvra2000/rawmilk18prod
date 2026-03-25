import { Injectable, signal, inject, NgZone, computed } from '@angular/core';

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayTrackService {
  private ngZone = inject(NgZone);
  
  // ✅ Manual Map Objects (Direct Control for Smoothness)
  private mapInstance: google.maps.Map | null = null;
  private playbackMarker: google.maps.Marker | null = null;
  private infoWindow: google.maps.InfoWindow | null = null;
  
  // ✅ History Elements (Manually managed)
  private historyMarkers: google.maps.Marker[] = [];
  private historyPolylines: google.maps.Polyline[] = [];

  // --- State Signals ---
  private _historyData = signal<any[]>([]); 
  
  // Public State
  readonly isPlaybackActive = signal<boolean>(false);
  readonly isHalted = signal<boolean>(false);
  readonly haltInfo = signal<any>(null);
  
  // Speed Configuration
  readonly playbackSpeed = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  private baseDuration = 1000; 

  private animationFrameId: number | null = null;
  private timeoutId: any = null;
  private currentIndex = 0;

  constructor() {
      // Initialization moved to setMapInstance
  }

  setMapInstance(map: google.maps.Map) {
      this.mapInstance = map;
      if (!this.infoWindow) {
          this.infoWindow = new google.maps.InfoWindow({ disableAutoPan: true });
      }
  }

  setSpeed(speed: number) {
      this.playbackSpeed.set(speed);
  }

  initialize(historyData: any[]) {
    console.log('Initializing PlayTrackService with history data:', historyData);
   let mappedData = historyData
    .filter(d => d.markerType === "tracking") // Step 1: Sirf 'tracking' wale items ko filter karein
    .map(d => ({                              // Step 2: Unhe format karein
        Latitude: d.position?.lat ?? d.Latitude,
        Longitude: d.position?.lng ?? d.Longitude,
        Speed: d.params?.['speed(Km/hr)'] ?? d.Speed ?? 0,
        vehicleStatus: d.params?.status ?? d.vehicleStatus ?? 'Running',
        device_time: d?.dateTime || d?.params?.dateTime,
        title: d.title,
        ...d 
    }));
     // ✅ 2. Pre-calculate Halt Durations
    mappedData = this.calculateHaltDurations(mappedData);
    console.log('Mapped History Data with Halt Durations:', mappedData);
    this._historyData.set(mappedData);
  }
  /**
   * ✅ NEW: Calculates how long the vehicle stopped at each point
   */
  private calculateHaltDurations(data: any[]): any[] {
    console.log('Calculating halt durations for data:', data);
      if (!data || data.length === 0) return data;

      let haltStartTime: Date | null = null;
      let startIndex = -1;

      for (let i = 0; i < data.length; i++) {
          const point = data[i];
          const speed = point.Speed;
          // Ensure date parsing is safe
          const currentTime = point.device_time ? new Date(point.device_time) : new Date();

          // Check if stopped (Speed 0 or very low)
          if (speed < 1) {
              if (!haltStartTime) {
                  haltStartTime = currentTime;
                  startIndex = i;
              }
              // If it's the last point and we are halted, calculate till now
              if (i === data.length - 1 && haltStartTime) {
                  const duration = this.getDurationString(haltStartTime, currentTime);
                  if (startIndex !== -1) data[startIndex].haltDuration = duration;
                  point.haltDuration = duration;
              }
          } else {
              // Vehicle started moving
              if (haltStartTime && startIndex !== -1) {
                  const haltEndTime = data[i - 1].device_time ? new Date(data[i - 1].device_time) : currentTime;
                  const duration = this.getDurationString(haltStartTime, haltEndTime);
                  
                  // Assign duration to the FIRST point of the stoppage sequence
                  data[startIndex].haltDuration = duration;
                  
                  // Reset
                  haltStartTime = null;
                  startIndex = -1;
              }
          }
      }
      return data;
  }

  private getDurationString(start: Date, end: Date): string {
      const diffMs = end.getTime() - start.getTime();
      if (isNaN(diffMs) || diffMs < 0) return "0 min";
      
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      if (hours > 0) return `${hours} hr ${mins} min`;
      return `${mins} min`;
  }
  togglePlayback() {
    if (this.isPlaybackActive()) {
      this.stop();
    } else {
      this.start();
    }
  }

  async start() {
    const history = this._historyData();
    if (!history || history.length < 2) {
        console.warn("⚠️ Not enough history data to play!");
        return;
    }
    if (!this.mapInstance) {
        console.error("⚠️ Map instance not set in PlayTrackService!");
        return;
    }
    
    console.log("▶️ Starting Play Track...");
    this.stop(); // Clear previous run
    
    this.isPlaybackActive.set(true);
    this.isLoading.set(true);
    this.currentIndex = 0;
    
    // 1. Create the Moving Truck Marker (Manual)
    await this.createPlaybackMarker(history[0]);
    
    this.isLoading.set(false);
    
    // 2. Pan to start
    this.mapInstance.panTo({ lat: history[0].Latitude, lng: history[0].Longitude });
    this.mapInstance.setZoom(10);

    // 3. Start Loop
    this.playNextSegment();
  }

  stop() {
    console.log("⏹️ Stopping Play Track...");
    this.isPlaybackActive.set(false);
    this.reset();
    
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    this.clearMapElements();
    
    if (this.infoWindow) this.infoWindow.close();
  }

  private reset() {
    this.isHalted.set(false);
    this.haltInfo.set(null);
  }

  private clearMapElements() {
    if (this.playbackMarker) {
        this.playbackMarker.setMap(null);
        this.playbackMarker = null;
    }
    this.historyMarkers.forEach(m => m.setMap(null));
    this.historyMarkers = [];
    this.historyPolylines.forEach(p => p.setMap(null));
    this.historyPolylines = [];
  }

  // ✅ MANUAL MARKER CREATION
  private async createPlaybackMarker(startPoint: any) {
      if (!this.mapInstance) return;

      const icon = await this.getVehicleIconByStatus('Running', 0); 

      this.playbackMarker = new google.maps.Marker({
          position: { lat: startPoint.Latitude, lng: startPoint.Longitude },
          map: this.mapInstance,
          icon: icon,
          zIndex: 9999, // Topmost
          optimized: false 
      });
  }

  // ✅ CORE LOOP
  private async playNextSegment() {
    if (!this.isPlaybackActive() || !this.playbackMarker) return;

    const history = this._historyData();
    
    if (this.currentIndex >= history.length - 1) {
        console.log("✅ Playback Finished");
        // Draw the final stop marker
        this.drawHistoryTrail(this.currentIndex, true);
        return; 
    }

    const currentPoint = history[this.currentIndex];
    const nextPoint = history[this.currentIndex + 1];

    // ✅ Draw Trail manually
    this.drawHistoryTrail(this.currentIndex);

    if (this.isStoppage(currentPoint)) {
        await this.handleStoppage(currentPoint);
        this.currentIndex++;
        this.playNextSegment();
    } else {
        await this.animateMovement(currentPoint, nextPoint);
        this.currentIndex++;
        this.playNextSegment();
    }
  }

  // ✅ Manual History Drawing (Dot + Polyline Segment)
  private drawHistoryTrail(index: number, isLastPoint = false) {
      if (!this.mapInstance) return;

      const history = this._historyData();
      const currentPoint = history[index];
      const prevPoint = index > 0 ? history[index - 1] : null;

      const currentPos = new google.maps.LatLng(currentPoint.Latitude, currentPoint.Longitude);
      
      // Marker Logic (Matching MarkerConfigService styles)
      let iconUrl = '';
      const speed = currentPoint.Speed || 0;

      if (index === 0) iconUrl = 'assets/imagesnew/start_marker.png';
      else if (isLastPoint) iconUrl = 'assets/imagesnew/stop_marker.png';
      else if (speed > 20) iconUrl = 'assets/imagesnew/green_Marker1.png';
      else if (speed > 5) iconUrl = 'assets/imagesnew/yellow_Marker1.png';
      else iconUrl = 'assets/imagesnew/red_Marker1.png';

      if (iconUrl) {
          const marker = new google.maps.Marker({
              position: currentPos,
              map: this.mapInstance,
              icon: iconUrl,
              zIndex: 10,
              title: currentPoint.title
          });
          marker.addListener('click', () => this.openInfoWindow(marker, currentPoint));
          this.historyMarkers.push(marker);
      }

      // Polyline Segment
      if (prevPoint) {
          const prevPos = new google.maps.LatLng(prevPoint.Latitude, prevPoint.Longitude);
          const polyline = new google.maps.Polyline({
              path: [prevPos, currentPos],
              strokeColor: '#ff0000',
              strokeOpacity: 1.0,
              strokeWeight: 1.5,
              icons: [{ 
                  icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW }, 
                  offset: '100%', 
                  repeat: '100px' 
              }],
              map: this.mapInstance
          });
          this.historyPolylines.push(polyline);
      }
  }

  private openInfoWindow(marker: google.maps.Marker, data: any) {
      if (!this.infoWindow || !this.mapInstance) return;
      
      const durationHtml = data.haltDuration ? `<br/><b>Stop Time: ${data.haltDuration}</b>` : '';

      const content = `
        <div style="padding: 5px; color: black; min-width: 150px;">
           <b>${data.title || 'Location'}</b><br/>
           Speed: ${data.Speed || 0} km/h<br/>
           Time: ${data.device_time || ''}
           ${durationHtml}
        </div>
      `;
      this.infoWindow.setContent(content);
      this.infoWindow.open(this.mapInstance, marker);
  }

  private async animateMovement(startData: any, endData: any) {
    const start = { lat: startData.Latitude, lng: startData.Longitude };
    const end = { lat: endData.Latitude, lng: endData.Longitude };

    const heading = this.calculateBearing(start, end);
    const icon = await this.getVehicleIconByStatus('Running', heading - 90);
    this.playbackMarker?.setIcon(icon);

    return new Promise<void>((resolve) => {
        const startTime = performance.now();
        const duration = this.baseDuration / this.playbackSpeed(); 

        const animate = (time: number) => {
            if (!this.isPlaybackActive()) { resolve(); return; }

            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const lat = start.lat + (end.lat - start.lat) * progress;
            const lng = start.lng + (end.lng - start.lng) * progress;
            const newPos = new google.maps.LatLng(lat, lng);
            
            this.playbackMarker?.setPosition(newPos);
              this.smoothPanTo(newPos);
            if (progress < 1) {
                this.animationFrameId = requestAnimationFrame(animate);
            } else {
                //  this.currentIndex++;
                // this.playNextSegment(); 
                resolve();
            }
        };

        this.ngZone.runOutsideAngular(() => {
            this.animationFrameId = requestAnimationFrame(animate);
        });
    });
  }
 // ✅ NEW: Auto Pan Feature
  private smoothPanTo(position: google.maps.LatLng) {
    if (!this.mapInstance) return;
    
    const bounds = this.mapInstance.getBounds();
    // Check if vehicle is out of current view
    if (bounds && !bounds.contains(position)) {
        this.mapInstance.panTo(position); // Slide map to new position
    }
  }
  private handleStoppage(point: any): Promise<void> {
      return new Promise((resolve) => {
          this.isHalted.set(true);
           const realDuration = point.haltDuration || "calculating...";


           if (realDuration === "0 min" || realDuration === "0 m") {
              resolve(); 
              return;
          }
          this.haltInfo.set({ ...point, duration: "3 sec" });

          this.getVehicleIconByStatus('Stopped', 0).then(icon => {
              this.playbackMarker?.setIcon(icon);
          });

          if (this.infoWindow && this.mapInstance && this.playbackMarker) {
             const content = ` <div style="padding: 5px; color: black; font-family: sans-serif; min-width: 150px;">
                    <b style="color:red">🛑 Stopped</b><br>
                    <span style="font-size: 13px;">${point.title || 'Unknown Location'}</span><br>
                    <span style="font-size: 12px; color: #333; margin-top:4px; display:inline-block;">
                        Duration: <b>${realDuration}</b>
                    </span>
                    </div>`;
             this.infoWindow.setContent(content);
             this.infoWindow.open(this.mapInstance, this.playbackMarker);
          }

          this.timeoutId = setTimeout(() => {
              this.ngZone.run(() => {
                  if (!this.isPlaybackActive()) return;
                  this.infoWindow?.close();
                  this.isHalted.set(false);
                  this.haltInfo.set(null);
                  resolve();
              });
          }, 3000);
      });
  }

  private isStoppage(point: any): boolean {
      const speed = point.Speed || 0;
      const status = point.vehicleStatus || '';
      return speed < 2 || ['stopped', 'idle', 'halt'].includes(status.toLowerCase());
  }

  private async getVehicleIconByStatus(status: string, angle: number): Promise<google.maps.Icon> {
    const baseUrl = 'assets/imagesnew/kml/vehicle/trucklive.png';
    const desiredWidth = 32;
    const desiredHeight = 12;

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = baseUrl;
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('No Context');
                
                const rads = (angle * Math.PI) / 180;
                const absCos = Math.abs(Math.cos(rads));
                const absSin = Math.abs(Math.sin(rads));
                
                canvas.width = desiredWidth * absCos + desiredHeight * absSin;
                canvas.height = desiredWidth * absSin + desiredHeight * absCos;
                
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(rads);
                ctx.drawImage(img, -desiredWidth / 2, -desiredHeight / 2, desiredWidth, desiredHeight);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                let targetColor: [number, number, number] | null = null;

                if (status === 'Running' || status === 'Active') targetColor = [0, 255, 0]; 
                else if (status === 'Inactive') targetColor = [128, 128, 128]; 

                if (targetColor) {
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                        if (a > 0 && r > 100 && g < 100 && b < 100) { 
                            data[i] = targetColor[0]; data[i+1] = targetColor[1]; data[i+2] = targetColor[2];
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                }
                
                resolve({
                    url: canvas.toDataURL('image/png'),
                    anchor: new google.maps.Point(canvas.width / 2, canvas.height / 2),
                    scaledSize: new google.maps.Size(canvas.width, canvas.height)
                });
            } catch (e) {
                resolve({ url: baseUrl, scaledSize: new google.maps.Size(32, 12) });
            }
        };
        img.onerror = () => resolve({ url: baseUrl, scaledSize: new google.maps.Size(32, 12) });
    });
  }

  private calculateBearing(start: {lat: number, lng: number}, end: {lat: number, lng: number}): number {
    const lat1 = start.lat * (Math.PI / 180);
    const lat2 = end.lat * (Math.PI / 180);
    const dLng = (end.lng - start.lng) * (Math.PI / 180);
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
}