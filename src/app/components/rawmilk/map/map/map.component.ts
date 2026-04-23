import {
  Component,
  Input,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { CommonModule } from '@angular/common';

import { GoogleMapLoaderService } from '../services/google-map-loader.service';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMap, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

  @ViewChild(GoogleMap) map!: GoogleMap;

  @Input() trackingData: any;
  @Input() selectedVehicle: any;
@Input() landmarks: any[] = [];
@Input() showLandmarks: boolean = false;


@Input() geofences: any[] = [];
@Input() showGeofences: boolean = false;
@Input() playTrack: boolean = false;

geofenceShapes: any[] = [];

landmarkMarkers: any[] = [];
  center = { lat: 26.4499, lng: 80.3319 };
  zoom = 10;
  mapOptions: any;

  isMapReady = false;
  mapInstance!: google.maps.Map;

  // DATA
  Map_info: any[] = [];
  Livemarkers: any[] = [];
  stoppageMarkers: any[] = [];
  polyline: any;

  infoWindow!: google.maps.InfoWindow;

  markerVisibility: any = {
    red: true,
    yellow: true,
    green: true,
    start: true,
    end: true
  };

  constructor(
    private loader: GoogleMapLoaderService,
    private service: HomeService
  ) {}

  async ngOnInit() {
    await this.loader.load();

    this.mapOptions = {
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      }
    };

    this.isMapReady = true;

    
  }


  

  onMapReady(map: google.maps.Map) {
    this.mapInstance = map;
    this.infoWindow = new google.maps.InfoWindow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trackingData'] && this.mapInstance) {
      this.renderTracking();
    }
      if (changes['showLandmarks'] && this.mapInstance) {

    if (this.showLandmarks) {
      this.plotLandmarks();
    } else {
      this.clearLandmarks();
    }
  }

    if (changes['showGeofences'] && this.mapInstance) {

    if (this.showGeofences) {
      this.plotGeofences();
    } else {
      this.clearGeofences();
    }
  }


  
  }

plotLandmarks() {

  this.clearLandmarks();

  this.landmarks.forEach((lm: any) => {

    const marker = new google.maps.Marker({
      position: {
        lat: Number(lm.Latitude),
        lng: Number(lm.Longitude)
      },
      map: this.mapInstance,
      icon: 'assets/imagesnew/landmark.png'
    });

    this.landmarkMarkers.push(marker);
  });
}


plotGeofences() {

  this.clearGeofences();

  this.geofences.forEach((g: any) => {

    // 👉 Example: circle geofence
    if (g.Type === 'Circle') {

      const circle = new google.maps.Circle({
        center: {
          lat: Number(g.Latitude),
          lng: Number(g.Longitude)
        },
        radius: Number(g.Radius || 100),
        map: this.mapInstance,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeColor: '#FF0000',
        strokeWeight: 2
      });

      this.geofenceShapes.push(circle);
    }

    // 👉 polygon geofence
    if (g.Type === 'Polygon' && g.Coordinates) {

      const path = g.Coordinates.map((c: any) => ({
        lat: Number(c.lat),
        lng: Number(c.lng)
      }));

      const polygon = new google.maps.Polygon({
        paths: path,
        map: this.mapInstance,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeColor: '#FF0000',
        strokeWeight: 2
      });

      this.geofenceShapes.push(polygon);
    }

  });
}

clearGeofences() {
  this.geofenceShapes.forEach(g => g.setMap(null));
  this.geofenceShapes = [];
}
clearLandmarks() {
  this.landmarkMarkers.forEach(m => m.setMap(null));
  this.landmarkMarkers = [];
}
  // ============================
  // MAIN RENDER
  // ============================
  renderTracking() {
    if (!this.trackingData) return;

    this.clearAll();

    this.Map_info = this.trackingData.points;

    this.plotPolyline();
    this.plotMarkers();
    this.plotStoppage(this.trackingData.stoppages);

    this.fitBounds();
  }

  // ============================
  // POLYLINE
  // ============================
  plotPolyline() {
    const path = this.Map_info.map(p => ({
      lat: Number(p.lat),
      lng: Number(p.long)
    }));

    this.polyline = new google.maps.Polyline({
      path,
      map: this.mapInstance,
      strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 4
    });
  }

  // ============================
  // MARKER CONFIG
  // ============================
  getMarkerConfig(i: number) {
    const total = this.Map_info.length;
    const speed = Number(this.Map_info[i]?.speed) || 0;

    if (i === 0) return { icon: 'assets/imagesnew/start_marker.png', color: 'start' };
    if (i === total - 1) return { icon: 'assets/imagesnew/stop_marker.png', color: 'end' };

    if (speed <= 5) return { icon: 'assets/imagesnew/red_Marker1.png', color: 'red' };
    if (speed <= 20) return { icon: 'assets/imagesnew/yellow_Marker1.png', color: 'yellow' };

    return { icon: 'assets/imagesnew/green_Marker1.png', color: 'green' };
  }

  shouldShowMarker(color: string): boolean {
    return this.markerVisibility[color];
  }

  // ============================
  // MARKERS
  // ============================
  // plotMarkers() {
  //   this.Map_info.forEach((point: any, i: number) => {

  //     const config = this.getMarkerConfig(i);
  //     if (!this.shouldShowMarker(config.color)) return;

  //     const marker = new google.maps.Marker({
  //       position: {
  //         lat: Number(point.lat),
  //         lng: Number(point.long)
  //       },
  //       map: this.mapInstance,
  //       icon: config.icon
  //     });

  //     marker.set('color', config.color);

  //     // ✅ FIXED HERE (IMPORTANT)
  //     marker.addListener('click', () => {
  //       this.openInfoWindow(marker, point);
  //     });

  //     this.Livemarkers.push(marker);
  //   });
  // }

  plotMarkers() {
  this.Map_info.forEach((point: any, i: number) => {

    const config = this.getMarkerConfig(i);
    if (!this.shouldShowMarker(config.color)) return;

    const marker = new google.maps.Marker({
      position: {
        lat: Number(point.lat),
        lng: Number(point.long)
      },
      map: this.mapInstance,
      icon: config.icon
    });

    marker.set('color', config.color);

    // 🔥 MERGE VEHICLE + POINT DATA
    // const fullData = {
    //   ...this.selectedVehicle, // vehicle info
    //   ...point                // tracking info
    // };

  marker.set('vehicle', this.selectedVehicle);
marker.set('point', point);

marker.addListener('click', () => {
  this.openInfoWindow(
    marker,
    marker.get('vehicle'),
    marker.get('point')
  );
});

    this.Livemarkers.push(marker);
  });
}
  // ============================
  // STOPPAGE
  // ============================
  plotStoppage(points: any[]) {
    points?.forEach(p => {

      const marker = new google.maps.Marker({
        position: {
          lat: Number(p.lat),
          lng: Number(p.long)
        },
        map: this.mapInstance,
        icon: {
          url: 'assets/imagesnew/icons-flag-big.png',
          scaledSize: new google.maps.Size(60, 40)
        },
        label: {
          text: p.duration_hrm,
          color: "#000",
          fontSize: "10px",
          fontWeight: "bold"
        }
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div>
            <b>Start:</b> ${p.start_time}<br>
            <b>End:</b> ${p.end_time}<br>
            <b>Duration:</b> ${p.duration_hrm}
          </div>
        `
      });

      marker.addListener('click', () => {
        info.open(this.mapInstance, marker);
      });

      this.stoppageMarkers.push(marker);
    });
  }

  // ============================
  // OLD INFOWINDOW (FINAL)
  // ============================
openInfoWindow(marker: google.maps.Marker, v: any, p: any) {

  if (!v || !p) return;

  let address = "Loading address...";

  const content = () => {

    // 🔵 MAIN DEVICE (TRACKING DATA)
    const mainHoleHtml = `
      <div style="margin-top:8px; padding-left:8px; border-left:3px solid #1d4380;">
        
        <div style="font-weight:600; color:#1d4380;">
          ${p.location || '-'}
        </div>

        <div><b>IMEI:</b> ${p.imei || '-'}</div>

        <div><b>Status:</b> ${v.VehicleStatus || '-'}</div>

        <div><b>Running:</b> ${v.RunningStatus || '-'}</div>

        <div><b>Battery:</b> ${p.BatteryVoltage || 0}% (${p.BatteryValue || 0}v)</div>

        <div><b>Speed:</b> ${Number(p.speed || 0).toFixed(1)} km/h</div>

        <div><b>Last Update:</b> ${p.device_time || '-'}</div>

       

      </div>
    `;

     // <div style="margin-top:4px;">
        //   ${p.io || ''}
        // </div>
    // 🟡 OTHER DEVICES (FROM VEHICLE)
    let otherDevicesHtml = '';

    if (v.otherDevices?.length) {
      otherDevicesHtml = v.otherDevices.map((d: any) => `
        <hr/>
        <div style="margin-top:8px; padding-left:8px; border-left:3px solid green;">
          
          <div style="font-weight:600; color:green;">
            ${d.Location || 'Delivery Hole'}
          </div>

          <div><b>IMEI:</b> ${d.ImeiNo || '-'}</div>
          <div><b>Status:</b> ${d.VehicleStatus || d.RunningStatus || '-'}</div>
          <div><b>Running:</b> ${d.RunningStatus || '-'}</div>
          <div><b>Battery:</b> ${d.Battery || 0}% (${d.BatteryVoltage || 0}v)</div>
          <div><b>Speed:</b> ${Number(p.speed || 0).toFixed(1)} km/h</div>
          <div><b>Last Update:</b> ${p.DeviceTime || '-'}</div>

        </div>
      `).join('');
    }

    // 🎯 FINAL HTML
    return `
      <div style="color:#1d4380; font-size:13px; min-width:270px;">

        <!-- HEADER -->
        <div style="font-weight:600;">
          🚚 ${v.VehicleNo || v.vnumber}

          <span style="font-size:12px; color:#555;">
            (${v.VehicleCategory || 'N/A'})
          </span>

          <span style="float:right;">
            ${v.VehicleStatus || ''}
          </span>
        </div>

        <!-- BODY -->
        <div style="margin-top:6px;">

          <div><b>Driver:</b> ${v.DriverName || '-'}</div>

          <div><b>Address:</b> ${address}</div>

          <div style="font-size:11px;">
            (${marker.getPosition()?.lat().toFixed(6)},
             ${marker.getPosition()?.lng().toFixed(6)})
          </div>

          <!-- 🔵 TRACKING DATA -->
          ${mainHoleHtml}

          <!-- 🟡 OTHER DEVICES -->
          ${otherDevicesHtml}

        </div>

        <!-- ACTION BUTTONS -->
        <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
          <button onclick="window.changeDriver('${v.VehicleId}')">Driver</button>
          <button onclick="window.changeStatus('${v.VehicleId}')">Status</button>
          <button onclick="window.addLandmark('${v.VehicleId}')">Landmark</button>
          <button onclick="window.addGeofence('${v.VehicleId}')">Geofence</button>
        </div>

      </div>
    `;
  };

  // 🔥 INITIAL RENDER
  this.infoWindow.setContent(content());
  this.infoWindow.open(this.mapInstance, marker);

  // 🔥 ADDRESS API
  const formData = new FormData();
  formData.append('AccessToken', localStorage.getItem('AccessToken')!);
  formData.append('VehicleId', v.VehicleId);
  formData.append('ImeiNo', p.imei);
  formData.append(
    'LatLong',
    `${marker.getPosition()?.lat()},${marker.getPosition()?.lng()}`
  );

  this.service.Lastlocation(formData).subscribe((res: any) => {

    if (res.Status === "Failed") {
      localStorage.removeItem('AccessToken');
      alert("Session expired! Login again.");
      location.href = 'https://secutrak.in/logout';
      return;
    }

    address = res.Data?.Address || "N/A";

    // 🔥 UPDATE UI
    this.infoWindow.setContent(content());
  });
}
  // ============================
  // FIT BOUNDS
  // ============================
  fitBounds() {
    const bounds = new google.maps.LatLngBounds();

    this.Map_info.forEach(p => {
      bounds.extend({
        lat: Number(p.lat),
        lng: Number(p.long)
      });
    });

    this.mapInstance.fitBounds(bounds);
  }

  // ============================
  // CLEAR
  // ============================
  clearAll() {
    this.Livemarkers.forEach(m => m.setMap(null));
    this.stoppageMarkers.forEach(m => m.setMap(null));

    if (this.polyline) {
      this.polyline.setMap(null);
    }

    this.Livemarkers = [];
    this.stoppageMarkers = [];
  }
}