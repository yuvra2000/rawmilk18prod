import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({ providedIn: 'root' })
export class MapService {

  private map!: google.maps.Map;

  // ✅ STORAGE
  private markers: google.maps.Marker[] = [];
  private liveMarkers: google.maps.Marker[] = [];
  private markerMap = new Map<string, google.maps.Marker>();

  private polylines: google.maps.Polyline[] = [];
  private polylineMap = new Map<string, google.maps.Polyline>();

  private infoWindow = new google.maps.InfoWindow();

  private geofences: google.maps.Polygon[] = [];

  // =====================================================
  // ✅ INIT
  // =====================================================
  initMap(map: google.maps.Map) {
    this.map = map;
  }

  getMap() {
    return this.map;
  }

  // =====================================================
  // ✅ MARKERS
  // =====================================================
  addMarkers(data: any[]) {
    this.clearMarkers();

    data.forEach(item => {
      const marker = new google.maps.Marker({
        position: item.position,
        map: this.map,
        icon: item.icon,
        title: item.title
      });

      // ✅ InfoWindow GLOBAL
      if (item.info) {
        marker.addListener('click', () => {
          this.infoWindow.close();
          this.infoWindow.setContent(item.info);
          this.infoWindow.open(this.map, marker);
        });
      }

      this.markers.push(marker);
    });

    this.fitBounds(data);
  }

  addMarkerWithId(id: string, data: any) {
    const marker = new google.maps.Marker({
      position: data.position,
      map: this.map,
      icon: data.icon
    });

    this.markerMap.set(id, marker);
  }

  updateMarker(id: string, position: any) {
    const marker = this.markerMap.get(id);
    if (marker) marker.setPosition(position);
  }

  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  clearAllMarkers() {
    this.markerMap.forEach(m => m.setMap(null));
    this.markerMap.clear();
  }

  // =====================================================
  // ✅ LIVE TRACKING (your existing logic improved)
  // =====================================================
  addLiveMarkers(data: any[]) {
    this.clearLiveMarkers();

    data.forEach(item => {
      const marker = new google.maps.Marker({
        position: item.position,
        map: this.map,
        icon: item.icon
      });

      this.liveMarkers.push(marker);
    });
  }

  toggleLiveMarkers(show: boolean) {
    this.liveMarkers.forEach(m => m.setMap(show ? this.map : null));
  }

  clearLiveMarkers() {
    this.liveMarkers.forEach(m => m.setMap(null));
    this.liveMarkers = [];
  }

  // =====================================================
  // ✅ POLYLINE
  // =====================================================
  drawPolyline(path: any[], id?: string) {
    const polyline = new google.maps.Polyline({
      path,
      strokeColor: '#FF0000',
      strokeWeight: 3
    });

    polyline.setMap(this.map);

    if (id) this.polylineMap.set(id, polyline);
    else this.polylines.push(polyline);
  }

  clearPolyline(id?: string) {
    if (id) {
      const poly = this.polylineMap.get(id);
      poly?.setMap(null);
      this.polylineMap.delete(id);
    } else {
      this.polylines.forEach(p => p.setMap(null));
      this.polylines = [];
    }
  }

  clearAllPolylines() {
    this.polylineMap.forEach(p => p.setMap(null));
    this.polylineMap.clear();
  }

  // =====================================================
  // ✅ INFO WINDOW (GLOBAL CONTROL)
  // =====================================================
  openInfoWindow(content: string, marker: google.maps.Marker) {
    this.infoWindow.close();
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  closeInfoWindow() {
    this.infoWindow.close();
  }

  // =====================================================
  // ✅ FIT BOUNDS
  // =====================================================
  fitBounds(data: any[]) {
    const bounds = new google.maps.LatLngBounds();
    data.forEach(d => bounds.extend(d.position));
    this.map.fitBounds(bounds);
  }

  // =====================================================
  // ✅ LAST LOCATION
  // =====================================================
  focus(position: any, zoom = 15) {
    this.map.panTo(position);
    this.map.setZoom(zoom);
  }

  // =====================================================
  // ✅ GEOFENCE
  // =====================================================
  drawPolygon(coords: any[]) {
    const polygon = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#2196F3',
      fillColor: '#2196F3',
      fillOpacity: 0.3
    });

    polygon.setMap(this.map);
    this.geofences.push(polygon);
  }

  clearGeofences() {
    this.geofences.forEach(p => p.setMap(null));
    this.geofences = [];
  }

  // =====================================================
  // ✅ RESET EVERYTHING (VERY IMPORTANT)
  // =====================================================
  resetMap() {
    this.clearMarkers();
    this.clearAllMarkers();
    this.clearPolyline();
    this.clearAllPolylines();
    this.clearLiveMarkers();
    this.clearGeofences();
    this.closeInfoWindow();
  }
}