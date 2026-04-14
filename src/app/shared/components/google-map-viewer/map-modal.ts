// components/modals/form-modal/form-modal.component.ts
import {
  Component,
  signal,
  computed,
  effect,
  inject,
  ViewChild,
  OnDestroy,
  untracked,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReusableModalComponent } from '../reusable-modal/reusable-modal.component';
import { GoogleMapViewerComponent } from '../google-map-viewer/google-map-viewer.component';
import { MarkerToggleComponent } from './shared/marker-toggle.component';
import { PolylineService } from '../../services/mapServices/polyline.service';
import { TripTimelineComponent } from './shared/trip-timeline.component';
import { VehicleTrackingService } from '../../services/vehicle-tracking.service';
import { LiveTrackingService } from './shared/LiveTracking.service';
import { isVehicleInactive } from './shared/constants/tracking.constants';
interface Marker {
  position: { lat: number; lng: number }; // अक्षांश (Latitude) और देशांतर (Longitude)
  title: string; // मार्कर का शीर्षक
  icon: {
    url: string; // मार्कर आइकन की छवि (Image) का URL
    // scaledSize: { width: number; height: number }
  };
  params: {}; // इंफोविंडो (Infowindow) में दिखाने के लिए अतिरिक्त डेटा
}

// 2. Map Input Data (common for both initial & alert)
export interface MapInputData {
  locationsPromise: Promise<Marker[]>;
  drawPolyline?: boolean;
  displayTools?: boolean;
  iconType?: string;
  vehicleStatus?: string; // ✅ Added
}

// 3. Initial Data (required center & zoom)
export interface InitialMapData extends MapInputData {
  center: { lat: number; lng: number };
  zoom: number;
  polygons?: any[];
  circles?: any[];
  rectangles?: any[];
}

// 4. Alert Data (no center/zoom)
export interface AlertMapData extends Omit<MapInputData, 'displayTools'> {
  displayTool?: boolean; // Note: typo in original — should be `displayTool`
}
interface timelineData {
  AccesToken?: string;
  from: number;
  to: number;
  imeis: string;
  portal: string;
}
// 5. Modal Data Interface (final structure)
export interface MapModalData {
  title: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  initialData: InitialMapData;
  alertData?: AlertMapData; // Optional
  customerData?: AlertMapData; // Optional
  timelineData?: timelineData;
  liveData?: any;
}

@Component({
  selector: 'map-modal',
  standalone: true,
  imports: [
    ReusableModalComponent,
    GoogleMapViewerComponent,
    MarkerToggleComponent,
    TripTimelineComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-base-modal
      [title]="config()?.title || 'Map Viewer'"
      [subtitle]="''"
      [showSaveButton]="true"
      bodyClass="form-modal-body"
      bodyHeight="80vh"
    >
      <!-- ✅ Split Layout Container -->
      <div class="d-flex h-100 w-100 overflow-hidden">
        <!-- LEFT SIDE: TIMELINE PANEL -->
        <!-- Render only if we have tracking markers to show -->
        @if (config()?.timelineData) {
          <!-- <div class="timeline-panel card me-2 border-end bg-white" > -->
          <app-trip-timeline
            class="timeline-panel"
            [events]="timelineEvents()"
            [isLoading]="isTimelineLoading()"
            (eventClicked)="handleTimelineClick($event)"
          ></app-trip-timeline>
          <!-- </div> -->
        }

        <!-- RIGHT SIDE: MAP PANEL -->
        <div class="map-panel flex-grow-1 position-relative">
          @if (config()?.initialData?.displayTools) {
            <div
              style="    position: absolute;
    bottom: 22px;
    right: 2px;
    z-index: 10;"
            >
              <app-marker-toggle
                [drawPolyline]="config()?.initialData?.drawPolyline ?? false"
              ></app-marker-toggle>
            </div>
          }

          <app-google-map-viewer
            #mapViewer
            [center]="
              config()?.initialData?.center ?? { lat: 26.8467, lng: 80.9462 }
            "
            [zoom]="config()?.initialData?.zoom || 8"
            [markers]="combinedMarkers()"
            [drawPolyline]="config()?.initialData?.drawPolyline ?? false"
            [iconType]="config()?.initialData?.iconType ?? 'tracking'"
            [vehicleStatus]="config()?.initialData?.vehicleStatus || ''"
            [polygons]="polygoncomp() || []"
            [circles]="config()?.initialData?.circles || []"
            [rectangles]="config()?.initialData?.rectangles || []"
          >
          </app-google-map-viewer>
        </div>
      </div>
    </app-base-modal>
  `,
  styles: [
    `
      .timeline-panel {
        flex-basis: 20%;
        width: 25%;
      }
      .form-modal-body {
        padding: 1.5rem;
        max-height: 60vh;
        overflow-y: auto;
      }
      /* details-modal-host.component.css */

      .fleet-details-header p {
        margin: 0.25rem 0; /* Adds a little space between lines */
        font-size: 14px;
        color: #1d4380;
      }

      .fleet-details-header p strong {
        color: #000;
        margin-right: 8px; /* Space between the label and the value */
      }
    `,
  ],
})
export class MapModalComponent implements OnDestroy {
  private polylineService = inject(PolylineService);
  private timelineservice = inject(VehicleTrackingService);
  private liveTrackingService = inject(LiveTrackingService); // ✅ Inject Service
  // alerts = input<Alerts>();
  mapReady = true;

  config = signal<MapModalData | null>(null);
  center = { lat: 26.8467, lng: 80.9462 };
  zoom = 8;

  readonly combinedMarkers = computed<Marker[]>(
    () => [
      ...this.markers(),
      ...this.markers_alerts(),
      ...this.markers_customer(),
    ],

    // return [...initialMarkers, ...alertMarkers,...customerMarkers];
  );

  //inputs from the parent component
  markers = signal<any[]>([]);
  markers_alerts = signal<any[]>([]);
  markers_customer = signal<any[]>([]);
  timelineEvents = signal<any[]>([]);

  isTimelineLoading = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  readonly trackingMarkers = computed<Marker[]>(() => {
    // हम केवल 'initialData' से मार्कर का उपयोग करते हैं,
    // क्योंकि 'alertData' मार्कर हमेशा ट्रैकिंग के लिए नहीं होते।
    // यदि आपके 'initialMarkers' में 'alert' प्रकार के मार्कर भी हैं,
    // तो आपको उन्हें फ़िल्टर करने की आवश्यकता होगी।
    return this.markers(); // 'markers' signal initialData के मार्कर रखता है।
  });

  // drawPolyline के लिए एक नया computed signal बनाएँ
  //  readonly drawPolyline = computed(() => this.initialData()?.drawPolyline ?? false);
  //  readonly displayTools= computed(() => this.initialData()?.displayTools ?? false);
  //  readonly iconType = computed(() => this.initialData()?.iconType ?? 'tracking');
  // @ViewChild('mapViewer') mapViewer!: GoogleMapViewerComponent;
  mapViewer = viewChild.required<GoogleMapViewerComponent>('mapViewer');
  private readonly timelineConfig = computed(() => this.config()?.timelineData);
  private readonly liveTrackingConfig = computed(() => this.config()?.liveData);
  private readonly initialDataConfig = computed(
    () => this.config()?.initialData,
  ); //tracking markers के लिए
  private readonly alertDataConfig = computed(() => this.config()?.alertData);
  private readonly customerDataConfig = computed(
    () => this.config()?.customerData,
  );
  polygoncomp = computed(() => this.config()?.initialData?.polygons);
  constructor() {
    // 1. History Data Effect
    effect(() => {
      const initial = this.initialDataConfig();
      const alert = this.alertDataConfig();
      const customer = this.customerDataConfig();
      untracked(() => {
        this.isLoading.set(true); // Loading ON

        const loadPromises = [];

        if (initial?.locationsPromise) {
          loadPromises.push(
            this.resolveAndSet(initial.locationsPromise, this.markers),
          );
        }
        if (alert?.locationsPromise) {
          loadPromises.push(
            this.resolveAndSet(alert.locationsPromise, this.markers_alerts),
          );
        }
        if (customer?.locationsPromise) {
          loadPromises.push(
            this.resolveAndSet(
              customer.locationsPromise,
              this.markers_customer,
            ),
          );
        }

        // Jab teeno API apna kaam khatam kar lein, tabhi Loading OFF karein
        Promise.allSettled(loadPromises).finally(() => {
          this.isLoading.set(false);
        });
      });
    });
    // 2. ✅ ISOLATED TIMELINE EFFECT
    // This will now ONLY run if 'timelineData' object changes.
    // effect(() => {
    //   const tData = this.timelineConfig();
    //   if (tData) {
    //     untracked(() => this.fetchTimelineData(tData));
    //   }
    // });

    // 3. ✅ ISOLATED LIVE TRACKING EFFECT
    effect(() => {
      const lData = this.liveTrackingConfig();
      if (lData) {
        untracked(() => {
          // ✅ Check: Is vehicle status inactive?
          // Note: 'liveData' object should have 'vehicleStatus' populated from MapLoader
          const status = this.config()?.initialData?.vehicleStatus;
          console.log('Live Tracking Vehicle Status:', status);
          if (status && isVehicleInactive(status)) {
            console.log(
              `🚫 Live Tracking SKIPPED in Modal: Vehicle status is '${status}'`,
            );
            // Ensure tracking is stopped if it was running (e.g. from previous modal instance)
            this.liveTrackingService.stopTracking();
            return;
          }

          console.log('🔄 Initializing Live Tracking...');
          this.liveTrackingService.startTracking(lData);
        });
      }
    });

    // 4. Polyline Effect
    effect(
      () => {
        const markersForPath = this.trackingMarkers();
        const shouldDrawPolyline = this.config()?.initialData?.drawPolyline;

        if (shouldDrawPolyline && markersForPath.length > 0) {
          const path = markersForPath.map((m) => m.position);
          this.polylineService.setPath(path);
        }
      },
      { allowSignalWrites: true },
    );

    console.log('polygonspolygonspolygonspolygons', this.config());
  }

  async loadLocations(promise: Promise<Marker[]> | undefined): Promise<void> {
    try {
      const processedMarkers: any = await promise;
      this.markers.set(processedMarkers);
    } catch (error) {
    } finally {
      // लोडिंग खत्म
    }
    console.log(this.config());
  }

  async loadalerts(promise: Promise<Marker[]> | undefined): Promise<void> {
    try {
      // ✅ Parent/Service से प्रोसेस किया हुआ डेटा प्राप्त करें
      const processedMarkers: any = await promise;
      this.markers_alerts.set(processedMarkers); // Markers सिग्नल को अपडेट करें
    } catch (error) {
      // Note: Error handling मुख्य रूप से सर्विस में हो रही है,
      // लेकिन हम इसे यहां भी पकड़ सकते हैं।
    } finally {
    }
  }
  async loadcustomer(promise: Promise<Marker[]> | undefined): Promise<void> {
    try {
      // ✅ Parent/Service से प्रोसेस किया हुआ डेटा प्राप्त करें
      const processedMarkers: any = await promise;
      this.markers_customer.set(processedMarkers); // Markers सिग्नल को अपडेट करें
    } catch (error) {
      // Note: Error handling मुख्य रूप से सर्विस में हो रही है,
      // लेकिन हम इसे यहां भी पकड़ सकते हैं।
    } finally {
    }
  }
  // async fetchTimelineData(requestBody: any) {
  //   console.log('response', requestBody);
  //   this.isTimelineLoading.set(true);
  //   try {
  //     const response: any =
  //       await this.timelineservice.fetchTimeline(requestBody);
  //     // Check if response is valid and has data
  //     if (Array.isArray(response) && response.length > 0) {
  //       this.timelineEvents.set(response);
  //     } else {
  //       this.timelineEvents.set([]); // Hide timeline if no data
  //     }
  //   } catch (error) {
  //     console.warn('error', error);
  //   } finally {
  //     this.isTimelineLoading.set(false);
  //   }
  // }
  handleTimelineClick(eventItem: any) {
    console.log('Timeline Item Clicked:', eventItem);
    let pos = null;

    // ✅ 1. Primary Check: Parse 'start_coords' string (Matches your data)
    if (eventItem.start_coords) {
      const parts = eventItem.start_coords.split(',');
      if (parts.length === 2) {
        pos = {
          lat: parseFloat(parts[0]),
          lng: parseFloat(parts[1]),
        };
      }
    }

    // 2. Secondary Check: Fallback for different data types (Will be skipped for your data)
    if (!pos && (eventItem.lat || eventItem.latitude)) {
      pos = {
        lat: parseFloat(eventItem.lat || eventItem.latitude),
        lng: parseFloat(eventItem.lng || eventItem.longitude),
      };
    }

    // 3. If valid position found, fly to it
    if (pos && !isNaN(pos.lat) && !isNaN(pos.lng)) {
      if (this.mapViewer()) {
        this.mapViewer().flyToLocation(pos, eventItem);
      }
    } else {
      console.warn('Invalid coordinates for timeline item:', eventItem);
    }
  }
  // Un teeno ki jagah sirf ye ek function aayega
  private async resolveAndSet(
    promise: Promise<any[]>,
    targetSignal: typeof this.markers,
  ): Promise<void> {
    try {
      const processedMarkers = await promise;
      targetSignal.set(processedMarkers || []);
      console.log('Markers loaded and set:', processedMarkers);
    } catch (error) {
      console.error('Failed to load map data:', error);
      targetSignal.set([]); // Fallback
    }
  }
  ngOnDestroy(): void {
    console.log('❌ Map Modal Destroyed - Stopping Live Tracking');
    this.liveTrackingService.stopTracking();
    this.liveTrackingService.ngOnDestroy(); //
    this.polylineService.clear(); // Clear polyline on destroy
  }
}
