import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapFormService {

  /**
   * ✅ Converts API Initial Data -> Map Objects (Markers, Polygons, etc.)
   */
  processInitialDrawings(data: any[]) {
    const result = {
      polygons: [] as any[],
      markers: [] as any[],
      circles: [] as any[],
      rectangles: [] as any[],
      center: null as google.maps.LatLngLiteral | null
    };

    if (!data || !Array.isArray(data)) return result;

    data.forEach(item => {
      // 1. Polygon
      if (item.type === 'polygon' && item.path) {
        result.polygons.push({
          paths: item.path,
          editable: true,
          draggable: true,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          strokeWeight: 2
        });
        if (!result.center && item.path.length > 0) result.center = item.path[0];
      }
      
      // 2. Marker
      else if (item.type === 'marker' && item.position) {
        result.markers.push({
          position: item.position,
          draggable: true,
          title: 'Location'
        });
        if (!result.center) result.center = item.position;
      }

      // 3. Circle
      else if (item.type === 'circle' && item.center) {
        result.circles.push({
          center: item.center,
          radius: item.radius || 1000,
          editable: true,
          draggable: true,
          fillColor: '#00FF00',
          fillOpacity: 0.35
        });
        if (!result.center) result.center = item.center;
      }

      // 4. Rectangle
      else if (item.type === 'rectangle' && item.bounds) {
        result.rectangles.push({
          bounds: item.bounds,
          editable: true,
          draggable: true,
          fillColor: '#0000FF',
          fillOpacity: 0.35
        });
        if (!result.center) {
           result.center = { lat: item.bounds.north, lng: item.bounds.west };
        }
      }
    });

    return result;
  }

  /**
   * ✅ Converts Map Events -> String for Form Control
   * Format: "(lat, lng),(lat, lng)"
   */
  convertShapeToCoordinates(event: any): string {
    if (!event) return '';

    switch (event.type) {
      case 'marker':
        return `${event.position.lat}, ${event.position.lng}`;

      case 'circle':
        return `${event.center.lat}, ${event.center.lng}`;

      case 'polygon':
        if (event.paths && Array.isArray(event.paths)) {
          // ✅ Updated Format: (lat, lng),(lat, lng)
          return event.paths.map((p: any) => `(${p.lat}, ${p.lng})`).join(',');
        }
        return '';

      case 'rectangle':
        if (event.bounds) {
          const { north, south, east, west } = event.bounds;
          // Returns 4 corners in (lat, lng),(lat, lng) format
          return [
            `(${north}, ${west})`, 
            `(${north}, ${east})`, 
            `(${south}, ${east})`, 
            `(${south}, ${west})`
          ].join(',');
        }
        return '';
        
      default:
        return '';
    }
  }

  /**
   * ✅ Parses String "(lat, lng),(lat, lng)" -> Polygon Path Array
   */
  parseToPolygonPath(coordString: string): google.maps.LatLngLiteral[] {
    if (!coordString || typeof coordString !== 'string') return [];

    // 1. Regex to find all groups inside parentheses: e.g. "(28.39, 71.31)"
    const matches = coordString.match(/\(([^)]+)\)/g);

    if (!matches || matches.length === 0) return [];

    const path: google.maps.LatLngLiteral[] = [];

    matches.forEach(pair => {
      // Remove ( and ) and split by comma
      const cleanPair = pair.replace(/[()]/g, ''); 
      const parts = cleanPair.split(',').map(s => parseFloat(s.trim()));

      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        path.push({ lat: parts[0], lng: parts[1] });
      }
    });

    return path;
  }

  /**
   * ✅ Calculates closest radius option for Circles
   */
  getClosestRadius(currentRadiusMeters: number, options: any[]): number {
    const radiusInKm = currentRadiusMeters / 1000;
    const validOptions = options?.map((opt: any) => opt.id) || [radiusInKm];
    
    return validOptions.reduce((prev: number, curr: number) => 
      Math.abs(curr - radiusInKm) < Math.abs(prev - radiusInKm) ? curr : prev
    );
  }

  /**
   * ✅ Parses Manual Input String -> LatLng Object
   * Handles simple "lat, lng"
   */
  parseInputToLatLng(inputVal: any): google.maps.LatLngLiteral | null {
    if (inputVal && typeof inputVal === 'string' && inputVal.includes(',')) {
      // Remove parenthesis if user pasted (lat, lng)
      const cleanInput = inputVal.replace(/[()]/g, '');
      const parts = cleanInput.split(',').map(s => parseFloat(s.trim()));
      
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
      }
    }
    return null;
  }
}