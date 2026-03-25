import {
  Component,
  input,
  ViewChild,
  OnInit,
  signal,
  inject,
  effect,
  computed,
  ViewChildren,
  QueryList,
  OnDestroy,
  output,
} from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapMarker,
  MapPolyline,
  MapCircle,
  MapPolygon,
  MapRectangle,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapInfoContentComponent } from '../map-info-content/map-info-content.component';
import { GoogleMapsLoaderService } from '../../services/google-maps-loader.service';
import { PolylineService } from '../../services/mapServices/polyline.service';
import { MarkerConfigService } from './shared/MarkerConfig.service';
import {
  CustomerMarkerData,
  GeofenceService,
  ProcessedGeofence,
} from './shared/geofence.service';
import { commonService } from '../../services/common.service';
import { LiveTrackingService } from './shared/LiveTracking.service';
import { PlayTrackService } from './shared/play-track.service';
// ✅ Define allowed drawing tool types for easier parent usage
export type DrawingTool = 'marker' | 'circle' | 'polygon' | 'rectangle';

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
  draggable?: boolean; // ✅ Added to interface
}
export interface GeofenceData {
  /** जियोफेंस का नाम (वैकल्पिक) */
  GeofenceName?: string;
  /** Radius in kilometers. 0.2 means 200 meters. */
  Radius: number;
  /**
   * Polygon coordinates string (e.g., "(lat1, lng1),(lat2, lng2),...")
   * If blank, a circle will be drawn using the lat/lng from the parent marker.
   */
  Geofence?: string;
  /**
   * Circle के मामले में केंद्र बिंदु (Parent Marker Lat/Lng).
   * यह Geofence के खाली होने पर उपयोग किया जाएगा।
   */
  center?: google.maps.LatLngLiteral;
}
@Component({
  selector: 'app-google-map-viewer',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMapsModule,
    MapInfoContentComponent,
    MapPolyline, // ✅ Added for <map-polyline>
    MapCircle, // ✅ Added for <map-circle>
    MapPolygon,
    MapRectangle,
  ],
  templateUrl: './google-map-viewer.component.html',
  styleUrls: ['./google-map-viewer.component.scss'],
})
export class GoogleMapViewerComponent implements OnInit, OnDestroy {
  private polylineService = inject(PolylineService);
  private MarkerConfigService = inject(MarkerConfigService);
  private geofenceService = inject(GeofenceService);
  private commonService = inject(commonService);
  private liveTrackingService = inject(LiveTrackingService);
  protected playTrackService = inject(PlayTrackService); // ✅ Protected
  // ... existing signals

  // ✅ New Signal for Live Vehicles

  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChildren(MapMarker) mapMarkers!: QueryList<MapMarker>;
  // --- Use the modern `input()` function for better type safety and signal compatibility ---
  center = input<google.maps.LatLngLiteral>({ lat: 20.5937, lng: 78.9629 });
  zoom = input<number>(6);
  markers = input<any[]>([]); // Default to an empty array if no markers are provided
  showGeofences = input<boolean>(true);
  vehicleStatus = input<string>('');
  // --- Use signals for internal component state ---
  mapReady = signal<boolean>(false);
  selectedMarkerData = signal<any | null>(null);
  drawPolyline = input<boolean>(false);
  iconType = input<string>('tracking'); // डिफ़ॉल्ट 'tracking'
  // Use a signal for the infoWindow reference for more reactive patterns
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  selectedGeofence = signal<ProcessedGeofence | null>(null);

  readonly processedMarkers = computed(() => {
    const originalMarkers = this.markers();
    const hiddenCategories = this.polylineService.hiddenMarkerCategories();

    return originalMarkers.map((marker) =>
      this.processMarker(marker, hiddenCategories),
    );
  });

  readonly displayMarkers = computed(() => {
    if (this.playTrackService.isPlaybackActive()) {
      return []; // Service handles manual rendering (Best performance/Smoothness)
    }
    return this.processedMarkers(); // Show full static history when not playing
  });
  readonly visibleGeofences = computed(() =>
    this.showGeofences() ? this.geofenceService.visibleGeofences() : [],
  );

  // private processMarker(marker: MarkerData, hiddenCategories: Record<string, boolean>) {
  //   const markerConfig = this.MarkerConfigService.getMarkerConfig(marker);

  //   const isHidden = !!hiddenCategories[markerConfig.category];

  //   return {
  //     ...marker,
  //     category: markerConfig.category,
  //     options: {
  //       icon: markerConfig.icon,
  //       visible: !isHidden,
  //       label: marker.label,
  //       zIndex: markerConfig.zIndex
  //     }
  //   };
  // }
  private processMarker(
    marker: MarkerData,
    hiddenCategories: Record<string, boolean>,
  ) {
    console.log('Processing marker ', this.vehicleStatus());
    const markerConfig = this.MarkerConfigService.getMarkerConfig(
      marker,
      this.vehicleStatus(),
    );
    const isHidden = !!hiddenCategories[markerConfig.category];

    // ✅ Construct Icon Object to include labelOrigin
    let iconObj: any = markerConfig.icon;

    // Check if icon is a string (URL) or object
    if (typeof iconObj === 'string') {
      iconObj = {
        url: iconObj,
        labelOrigin: marker.icon?.labelOrigin, // ✅ Add labelOrigin
        scaledSize: marker.icon?.scaledSize,
      };
    } else if (iconObj && typeof iconObj === 'object') {
      // If it's already an object, merge properties
      iconObj = {
        ...iconObj,
        labelOrigin: marker.icon?.labelOrigin || iconObj.labelOrigin,
        scaledSize: marker.icon?.scaledSize || iconObj.scaledSize,
      };
    }

    return {
      ...marker,
      category: markerConfig.category,
      options: {
        icon: iconObj,
        visible: !isHidden,
        label: marker.label,
        zIndex: markerConfig.zIndex,

        // ✅ Allow draggable if param set
        draggable: marker.draggable ?? marker.params?.['draggable'] ?? false,
      },
    };
  }
  readonly customerGeofenceMarkers = computed(() => {
    const currentMarkers = this.markers();
    // Only filter if markers exist
    if (currentMarkers.length === 0) {
      return [];
    }

    // Filter only customer markers that might contain geofence data
    return currentMarkers.filter(
      (m): m is CustomerMarkerData => m.markerType === 'customer',
    );
  });
  // Drawing Manager Options
  // ✅ NEW INPUTS for Drawing
  enableMapClick = input<boolean>(false);
  enableDrawing = input<boolean>(false); // Toggle Drawing Manager

  // ✅ OUTPUTS
  mapAnyClick = output<google.maps.LatLngLiteral>();
  shapeCreated = output<any>(); // Emits drawn shape data (Circle/Polygon/Marker)

  // ✅ Drawing Options (Initialized when map is ready to ensure google namespace exists)
  drawingControlOptions: google.maps.drawing.DrawingControlOptions | undefined;
  drawingReady = signal<boolean>(false);
  // ✅ Native Drawing Manager Instance
  private drawingManager: google.maps.drawing.DrawingManager | null = null;
  private drawnOverlays: any[] = [];
  hasDrawings = signal<boolean>(false);
  // ✅ NEW: Inputs for Editing Shapes (These caused the errors before)
  polygons = input<any[]>([]);
  circles = input<any[]>([]);
  rectangles = input<any[]>([]);
  // ✅ NEW: Output for Shape Edits (Drag/Resize events)
  shapeEdited = output<any>();
  // ✅ NEW: Configure allowed drawing tools (Default: All)
  allowedDrawingTools = input<DrawingTool[]>([
    'marker',
    'circle',
    'polygon',
    'rectangle',
  ]);

  constructor(private mapsLoader: GoogleMapsLoaderService) {
    effect(
      () => {
        const rawData = this.markers(); // Use RAW markers for service to initialize
        if (rawData.length > 0) {
          console.log('Initializing PlayTrackService with markers:', rawData);
          this.playTrackService.initialize(rawData);
        }
      },
      { allowSignalWrites: true },
    ); // <--- NG0600 FIX

    effect(() => {
      if (!this.mapReady() || !this.drawPolyline()) return;

      const bounds = this.polylineService.bounds();
      if (bounds && this.map) {
        this.map.fitBounds(bounds);
      }
    });
    // New: Process geofences when customer markers change
    effect(
      () => {
        // Read dependencies
        const customerMarkers = this.customerGeofenceMarkers(); // Uses computed signal
        const isReady = this.mapReady();
        const shouldShow = this.showGeofences();

        if (isReady && shouldShow) {
          if (customerMarkers.length > 0) {
            // ✅ FIX: Allowed Signal Write Context
            this.geofenceService.processGeofences(customerMarkers);
          } else {
            this.geofenceService.clearGeofences();
          }
        } else if (isReady && !shouldShow) {
          // Clear geofences if map is ready but showGeofences is false
          this.geofenceService.clearGeofences();
        }
      },
      { allowSignalWrites: true },
    ); // <--- NG0600 FIX
    // ✅ Effect to toggle Drawing Manager based on input
    // effect(() => {
    //     const isDrawingEnabled = this.enableDrawing();
    //     if (this.drawingManager && this.map?.googleMap) {
    //         this.drawingManager.setMap(isDrawingEnabled ? this.map.googleMap : null);
    //     }
    // });
    effect(() => {
      const isDrawingEnabled = this.enableDrawing();

      if (this.drawingManager && this.map?.googleMap) {
        this.drawingManager.setMap(
          isDrawingEnabled ? this.map.googleMap : null,
        );

        // ✅ CRITICAL LOGIC: Set Cursor Mode based on Data Presence
        if (isDrawingEnabled) {
          this.setInitialDrawingMode();
        }
      }
    });
    effect(() => {
      const tools = this.allowedDrawingTools();
      if (this.drawingManager && google?.maps?.drawing) {
        const activeModes = this.getGoogleDrawingModes(tools);

        this.drawingManager.setOptions({
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: activeModes,
          },
        });
      }
    });

    console.log('polygonspolygonspolygonspolygons', this.polygons());
  }

  ngOnInit(): void {
    // Load the Google Maps API and update the mapReady signal
    this.mapsLoader
      .load()
      .then(() => {
        this.mapReady.set(true);
        // automatically prepare a polyline from markers
        // const path = this.markers().map(m => m.position);
        // console.log(path)
        // this.polylineService.setPath(path);
      })
      .catch((err) => {
        // Optionally, you could set an error state here
      });
  }

  /**
   * Opens the info window for a clicked marker.
   * @param marker The data object for the clicked marker.
   * @param markerRef The reference to the MapMarker component instance.
   */
  openInfo(marker: any, markerRef: MapMarker): void {
    const params = marker.params || {};
    this.selectedMarkerData.set(params);
    this.infoWindow.open(markerRef);

    // ✅ Check Address on manual click too
    if (marker.position) {
      this.checkAndFetchAddress(params, marker.position);
    }
  }
  togglePolyline(): void {
    this.polylineService.toggle();
  }
  get polylinePath() {
    return this.polylineService.polylinePath;
  }
  get polylineOptions() {
    return this.polylineService.polylineOptions;
  }
  get showPolyline() {
    return this.polylineService.showPolyline;
  }

  onGeofenceClick(geofence: ProcessedGeofence, event: any): void {
    this.selectedGeofence.set(geofence);

    const clickPosition = event.latLng?.toJSON();

    // Optional: Show info about geofence
    this.showGeofenceInfo(geofence);
  }

  /**
   * ✅ NEW: Show geofence information (optional implementation)
   */
  private showGeofenceInfo(geofence: ProcessedGeofence): void {
    const info: Record<string, any> = {
      name: geofence.name,
      type: geofence.type === 'circle' ? 'Circle Zone' : 'Polygon Zone',
    };

    if (geofence.type === 'circle') {
      info['center'] = geofence.center;
      info['radius'] = `${(geofence.radius! / 1000).toFixed(2)} km`;
    } else {
      info['points'] = geofence.paths?.length || 0;
    }

    // You can also show this in an info window or toast notification
  }

  /**
   * ✅ NEW: Toggle specific geofence visibility
   */
  toggleGeofenceVisibility(id: string): void {
    this.geofenceService.toggleGeofence(id);
  }

  /**
   * ✅ NEW: Get geofence statistics
   */
  getGeofenceStats() {
    return this.geofenceService.getStats();
  }
  flyToLocation(location: google.maps.LatLngLiteral, timelineData: any) {
    if (this.map && location) {
      console.log('🚀 Flying to location:', location);

      // 1. Pan and Zoom
      this.map.panTo(location);
      this.map.googleMap?.setZoom(16);

      // 2. Search for Nearest Plotted Marker
      const plottedMarkers = this.processedMarkers();
      let closestIndex = -1;
      let minDistance = Number.MAX_VALUE;

      // Threshold: 0.0005 degrees is roughly 50 meters
      const THRESHOLD = 0.0005;

      plottedMarkers.forEach((m, index) => {
        const latDiff = Math.abs(m.position.lat - location.lat);
        const lngDiff = Math.abs(m.position.lng - location.lng);
        const dist = latDiff + lngDiff;

        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = index;
        }
      });

      // 3. Logic: Check if match found within threshold
      if (closestIndex !== -1 && minDistance < THRESHOLD) {
        // ✅ SCENARIO A: Found existing marker on map
        console.log('📍 Found matching Map Marker. Opening its info.');

        // Use MAP MARKER Data (Already has correct params structure)
        const mapMarkerData = plottedMarkers[closestIndex];
        const params = mapMarkerData.params || {};

        this.selectedMarkerData.set(params);
        // ✅ Check & Fetch Address if missing
        this.checkAndFetchAddress(params, mapMarkerData.position);

        // Open InfoWindow anchored to the actual MapMarker component
        const markerInstances = this.mapMarkers.toArray();
        if (markerInstances[closestIndex]) {
          this.infoWindow.open(markerInstances[closestIndex]);
        }
      } else {
        // ✅ SCENARIO B: No existing marker nearby (Timeline Point)
        console.log(
          '⚠️ No Map Marker match. Transforming Timeline Data to Params format.',
        );

        // 🔄 TRANSFORM: Convert Timeline Data keys to Standard Marker Params keys
        const standardizedParams = {
          ...timelineData, // Spread original to keep ids like VehicleId/Imei
          speed: timelineData.averageSpeed ?? timelineData.speed ?? 0,
          address:
            timelineData.cleanStartLocation ??
            timelineData.start_location ??
            'Unknown Location',
          received_date: timelineData.start_time ?? timelineData.date,
          status:
            timelineData.type === 'travel'
              ? 'Moving'
              : timelineData.type === 'stoppage'
                ? 'Stop'
                : 'Idle',
          distance: timelineData.distance,
          duration: timelineData.duration || timelineData.travelTime,
        };

        // Set transformed data
        this.selectedMarkerData.set(standardizedParams);
        // ✅ Check & Fetch Address if missing
        this.checkAndFetchAddress(standardizedParams, location);

        // Open InfoWindow at the position (Floating)
        if (this.infoWindow) {
          this.infoWindow.options = {
            ...this.infoWindow.options,
            position: location,
            pixelOffset: new google.maps.Size(0, -40),
          };
          this.infoWindow.open();
        }
      }
    }
  }

  /**
   * Helper to find the closest marker on the map and open it
   */

  private checkAndFetchAddress(params: any, latLng: google.maps.LatLngLiteral) {
    // Common keys where address might be stored
    const addressValue =
      params['address'] ||
      params['Address'] ||
      params['location'] ||
      params['Location'];

    // Check if address is missing or invalid
    if (!addressValue || addressValue === 'N/A' || addressValue.trim() === '') {
      console.log('🔍 Address missing in params, fetching from API...', params);

      const formData = new FormData();
      //  formData.append('AccessToken', this.token);
      formData.append(
        'VehicleId',
        params['VehicleId'] || params['vehicleId'] || params['vehicleNo'] || '',
      );
      formData.append(
        'ImeiNo',
        params['ImeiNo'] || params['Imei'] || params['imei_no'] || '',
      );
      formData.append('LatLong', params['Lat Long'] || params?.latlng);
      formData.append('portal', 'itraceit');
      // Call API Service
      this.commonService.vehicleLastLocationV3(formData).subscribe({
        next: (res: any) => {
          if (res && res.Status === 'success' && res.Data && res.Data.Address) {
            console.log('✅ Address fetched:', res.Data.Address);

            // Create a new object with the updated Address to trigger Signal update
            const updatedParams = {
              ...params,
              Address: res.Data.Address, // Standardize key for InfoWindow
              // address: res.Data.Address // Support both cases
            };
            this.selectedMarkerData.set(updatedParams);
          }
        },
        error: (err: any) => console.error('❌ Failed to fetch address:', err),
      });
    }
  }

  onMapInitialized(map: google.maps.Map) {
    console.log('Map Initialized - Passing instance to LiveTrackingService');
    this.liveTrackingService.setMapInstance(map);
    this.playTrackService.setMapInstance(map); // Pass to Play Service
    if (this.enableDrawing()) {
      this.initDrawingManager(map);
    }
  }
  private initDrawingManager(map: google.maps.Map) {
    if (!this.drawingManager && google?.maps?.drawing) {
      const activeModes = this.getGoogleDrawingModes(
        this.allowedDrawingTools(),
      );

      this.drawingManager = new google.maps.drawing.DrawingManager({
        // Default to first allowed mode or null
        //  drawingMode: null,
        drawingMode: activeModes.length > 0 ? activeModes[0] : null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: activeModes, // ✅ Use configured modes
        },
        // ✅ Make Shapes Draggable & Editable
        markerOptions: { draggable: true },
        circleOptions: {
          draggable: true,
          editable: true,
          fillColor: '#FF6B6B',
          fillOpacity: 0.3,
          strokeColor: '#FF6B6B',
          strokeWeight: 2,
        },
        polygonOptions: {
          draggable: true,
          editable: true,
          fillColor: '#4ECDC4',
          fillOpacity: 0.3,
          strokeColor: '#4ECDC4',
          strokeWeight: 2,
        },
        rectangleOptions: {
          draggable: true,
          editable: true,
          fillColor: '#FFE66D',
          fillOpacity: 0.3,
          strokeColor: '#FFE66D',
          strokeWeight: 2,
        },
        map: map,
      });

      // Listen for completion events
      google.maps.event.addListener(
        this.drawingManager,
        'overlaycomplete',
        (event: any) => {
          this.onOverlayComplete(event);
        },
      );
      // ✅ Apply Initial Logic
      this.setInitialDrawingMode();
    } else if (this.drawingManager) {
      this.drawingManager.setMap(map);
      //  this.drawingManager.setDrawingMode(null);
      this.setInitialDrawingMode();
    }
  }
  // ✅ New Helper: Centralized Logic for Cursor Mode
  private setInitialDrawingMode() {
    if (!this.drawingManager) return;

    const activeModes = this.getGoogleDrawingModes(this.allowedDrawingTools());

    // Check if ANY data exists in inputs
    const hasExistingData =
      this.polygons().length > 0 ||
      this.circles().length > 0 ||
      this.rectangles().length > 0 ||
      this.markers().length > 0;

    if (hasExistingData) {
      // Case 1: Data Exists (Edit Mode) -> HAND CURSOR (Null)
      // User can select existing shapes to edit
      console.log('✏️ Edit Mode detected: Setting cursor to Hand (Normal).');
      this.drawingManager.setDrawingMode(null);
    } else {
      // Case 2: No Data (Add Mode) -> PLUS CURSOR (First Tool Active)
      // User can start drawing immediately
      const defaultMode = activeModes.length > 0 ? activeModes[0] : null;
      console.log(
        '➕ Add Mode detected: Setting cursor to Drawing Tool:',
        defaultMode,
      );
      this.drawingManager.setDrawingMode(defaultMode);
    }
  }
  private getGoogleDrawingModes(
    tools: DrawingTool[],
  ): google.maps.drawing.OverlayType[] {
    const modeMap: Record<string, google.maps.drawing.OverlayType> = {
      marker: google.maps.drawing.OverlayType.MARKER,
      circle: google.maps.drawing.OverlayType.CIRCLE,
      polygon: google.maps.drawing.OverlayType.POLYGON,
      rectangle: google.maps.drawing.OverlayType.RECTANGLE,
    };

    return tools.map((t) => modeMap[t]).filter((m) => m !== undefined);
  }
  // ✅ Handle Map Click (Only if enabled)
  // Handle Map Click
  onMapBackgroundClick(event: google.maps.MapMouseEvent) {
    // ✅ If drawing is enabled, let Drawing Manager handle clicks, ignore here
    if (this.enableDrawing()) return;

    if (this.enableMapClick() && event.latLng) {
      const coords = event.latLng.toJSON();
      console.log('📍 New Location Selected:', coords);
      this.mapAnyClick.emit(coords);
    }
  }
  // ✅ Handle Drawing Complete
  //   onOverlayComplete(event: any) {
  //       console.log('🎨 Shape Drawn:', event.type);

  //       // Keep track of the overlay to remove later if needed
  //       if (event.overlay) {
  //           this.drawnOverlays.push(event.overlay);
  //       }

  //       let shapeData: any = { type: event.type };

  //       // ⚠️ IMPORTANT: I commented out the lines that remove the shape (setMap(null))
  //       // This ensures the shape stays visible after drawing.

  //       if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
  //           const circle = event.overlay as google.maps.Circle;
  //           shapeData.center = circle.getCenter()?.toJSON();
  //           shapeData.radius = circle.getRadius();
  //           // circle.setMap(null); // ❌ REMOVED: Keep it visible
  //       }
  //       else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
  //           const polygon = event.overlay as google.maps.Polygon;
  //           const paths = polygon.getPath().getArray().map(p => p.toJSON());
  //           shapeData.paths = paths;
  //           // polygon.setMap(null); // ❌ REMOVED: Keep it visible
  //       }
  //       else if (event.type === google.maps.drawing.OverlayType.MARKER) {
  //           const marker = event.overlay as google.maps.Marker;
  //           shapeData.position = marker.getPosition()?.toJSON();
  //           // marker.setMap(null); // ❌ REMOVED: Keep it visible
  //       }
  //       else if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
  //            const rect = event.overlay as google.maps.Rectangle;
  //            shapeData.bounds = rect.getBounds()?.toJSON();
  //            // rect.setMap(null); // ❌ REMOVED: Keep it visible
  //       }

  //       this.shapeCreated.emit(shapeData);
  //   }
  //  // ✅ NEW: Allows parent to clear manual drawings (e.g. when typing manually)
  //   public clearDrawings() {
  //       if (this.drawnOverlays.length > 0) {
  //           console.log('🧹 Clearing manual drawings...');
  //           this.drawnOverlays.forEach(overlay => overlay.setMap(null));
  //           this.drawnOverlays = [];
  //       }
  //   }
  // ✅ Handle Native Drawing Complete Event
  // onOverlayComplete(event: any) {
  //     console.log('🎨 Shape Drawn:', event.type);

  //     if (event.overlay) {
  //         this.drawnOverlays.push(event.overlay);
  //         this.hasDrawings.set(true); // Show Undo Button

  //         // ✅ FIX 1: Auto-Disable Drawing Mode (Reset Cursor)
  //         if (this.drawingManager) {
  //            this.drawingManager.setDrawingMode(null);
  //         }
  //     }

  //     let shapeData: any = { type: event.type };

  //     if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
  //         const circle = event.overlay as google.maps.Circle;
  //         shapeData.center = circle.getCenter()?.toJSON();
  //         shapeData.radius = circle.getRadius();
  //     }
  //     else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
  //         const polygon = event.overlay as google.maps.Polygon;
  //         const paths = polygon.getPath().getArray().map(p => p.toJSON());
  //         shapeData.paths = paths;
  //     }
  //     else if (event.type === google.maps.drawing.OverlayType.MARKER) {
  //         const marker = event.overlay as google.maps.Marker;
  //         shapeData.position = marker.getPosition()?.toJSON();
  //     }
  //     else if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
  //          const rect = event.overlay as google.maps.Rectangle;
  //          shapeData.bounds = rect.getBounds()?.toJSON();
  //     }

  //     this.shapeCreated.emit(shapeData);
  // }

  // // ✅ FIX 2: Undo Last Drawing (User Friendly)
  // public undoLastDrawing() {
  //     if (this.drawnOverlays.length > 0) {
  //         const lastOverlay = this.drawnOverlays.pop();
  //         lastOverlay.setMap(null); // Remove from map

  //         if (this.drawnOverlays.length === 0) {
  //             this.hasDrawings.set(false);
  //         }
  //     }
  // }

  // public clearDrawings() {
  //     if (this.drawnOverlays.length > 0) {
  //         console.log('🧹 Clearing manual drawings...');
  //         this.drawnOverlays.forEach(overlay => overlay.setMap(null));
  //         this.drawnOverlays = [];
  //         this.hasDrawings.set(false);
  //     }
  // }

  // ✅ Handle Native Drawing Complete Event
  onOverlayComplete(event: any) {
    console.log('🎨 Shape Drawn:', event.type);

    const overlay = event.overlay;
    if (overlay) {
      this.drawnOverlays.push({ overlay: overlay, type: event.type });
      this.hasDrawings.set(true);

      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
      }

      // ✅ Add Listeners to update data on Drag/Edit
      this.addShapeListeners(overlay, event.type);
    }

    // 2. Extract Data and Emit
    const shapeData = this.extractShapeData(event.type, event.overlay);
    this.shapeCreated.emit(shapeData);
  }

  // ✅ Helper to extract data from overlay (Used for Undo as well)
  private extractShapeData(type: any, overlay: any): any {
    let shapeData: any = { type: type };

    if (type === google.maps.drawing.OverlayType.CIRCLE) {
      const circle = overlay as google.maps.Circle;
      shapeData.center = circle.getCenter()?.toJSON();
      shapeData.radius = circle.getRadius();
    } else if (type === google.maps.drawing.OverlayType.POLYGON) {
      const polygon = overlay as google.maps.Polygon;
      const paths = polygon
        .getPath()
        .getArray()
        .map((p) => p.toJSON());
      shapeData.paths = paths;
    } else if (type === google.maps.drawing.OverlayType.MARKER) {
      const marker = overlay as google.maps.Marker;
      shapeData.position = marker.getPosition()?.toJSON();
    } else if (type === google.maps.drawing.OverlayType.RECTANGLE) {
      const rect = overlay as google.maps.Rectangle;
      shapeData.bounds = rect.getBounds()?.toJSON();
    }
    return shapeData;
  }

  // ✅ Undo Last Drawing & Update Form
  public undoLastDrawing() {
    if (this.drawnOverlays.length > 0) {
      const lastEntry = this.drawnOverlays.pop();
      if (lastEntry?.overlay) {
        lastEntry.overlay.setMap(null); // Remove from map
      }

      if (this.drawnOverlays.length === 0) {
        this.hasDrawings.set(false);
        this.shapeCreated.emit(null); // ✅ Emit null to clear form
      } else {
        // ✅ Re-emit the previous shape to update form back to it
        const prevEntry = this.drawnOverlays[this.drawnOverlays.length - 1];
        const shapeData = this.extractShapeData(
          prevEntry.type,
          prevEntry.overlay,
        );
        this.shapeCreated.emit(shapeData);
      }
    }
  }

  // ✅ Clear All & Update Form
  public clearDrawings() {
    if (this.drawnOverlays.length > 0) {
      console.log('🧹 Clearing manual drawings...');
      this.drawnOverlays.forEach((entry) => entry.overlay.setMap(null));
      this.drawnOverlays = [];
      this.hasDrawings.set(false);
      this.shapeCreated.emit(null); // ✅ Emit null to clear form
    }
  }
  ngOnDestroy() {
    this.liveTrackingService.stopTracking();
    this.playTrackService.stop(); // Cleanup
    // ✅ Clean up drawn overlays
    // this.drawnOverlays.forEach(overlay => overlay.setMap(null));
    // this.drawnOverlays = [];

    // if (this.drawingManager) {
    //     this.drawingManager.setMap(null);
    // }
    this.clearDrawings();
    if (this.drawingManager) {
      this.drawingManager.setMap(null);
    }
  }
  // ✅ Add listeners to update parent when shape changes
  private addShapeListeners(overlay: any, type: any) {
    if (type === google.maps.drawing.OverlayType.MARKER) {
      google.maps.event.addListener(overlay, 'dragend', () =>
        this.emitShapeData(type, overlay),
      );
    } else if (type === google.maps.drawing.OverlayType.CIRCLE) {
      google.maps.event.addListener(overlay, 'radius_changed', () =>
        this.emitShapeData(type, overlay),
      );
      google.maps.event.addListener(overlay, 'center_changed', () =>
        this.emitShapeData(type, overlay),
      );
      google.maps.event.addListener(overlay, 'dragend', () =>
        this.emitShapeData(type, overlay),
      );
    } else if (type === google.maps.drawing.OverlayType.POLYGON) {
      const path = overlay.getPath();
      google.maps.event.addListener(path, 'set_at', () =>
        this.emitShapeData(type, overlay),
      );
      google.maps.event.addListener(path, 'insert_at', () =>
        this.emitShapeData(type, overlay),
      );
      google.maps.event.addListener(overlay, 'dragend', () =>
        this.emitShapeData(type, overlay),
      );
    } else if (type === google.maps.drawing.OverlayType.RECTANGLE) {
      google.maps.event.addListener(overlay, 'bounds_changed', () =>
        this.emitShapeData(type, overlay),
      );
      google.maps.event.addListener(overlay, 'dragend', () =>
        this.emitShapeData(type, overlay),
      );
    }
  }
  private emitShapeData(type: any, overlay: any) {
    const shapeData = this.extractShapeData(type, overlay);
    console.log('✏️ Shape Updated:', shapeData);
    this.shapeCreated.emit(shapeData);
  }

  // --- ✅ NEW: Shape Editing Handlers ---

  // 1. Marker Drag End
  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.shapeEdited.emit({
        type: 'marker',
        position: event.latLng.toJSON(),
      });
    }
  }

  // 2. Circle Changes (Center or Radius)
  onCircleCenterChange(event: any, circleRef: MapCircle) {
    const center = circleRef.getCenter()?.toJSON();
    const radius = circleRef.getRadius();
    if (center && radius) {
      this.shapeEdited.emit({ type: 'circle', center, radius });
    }
  }

  onCircleRadiusChange(event: any, circleRef: MapCircle) {
    const center = circleRef.getCenter()?.toJSON();
    const radius = circleRef.getRadius();
    if (center && radius) {
      this.shapeEdited.emit({ type: 'circle', center, radius });
    }
  }

  // 3. Rectangle Bounds Change
  onRectangleBoundsChange(event: any, rectRef: MapRectangle) {
    const bounds = rectRef.getBounds()?.toJSON();
    if (bounds) {
      this.shapeEdited.emit({ type: 'rectangle', bounds });
    }
  }

  // 4. Polygon Path Changes
  // Triggered on mouseup to catch end of drag/edit
  onPolygonEdit(polyRef: MapPolygon) {
    const path = polyRef.getPath();
    if (path) {
      const paths = path.getArray().map((p) => p.toJSON());
      this.shapeEdited.emit({ type: 'polygon', paths });
    }
  }
}
