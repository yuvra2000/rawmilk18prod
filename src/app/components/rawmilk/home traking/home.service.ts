import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, private masterRequest: MasterRequestService) { }
  vehicleList(val: any) {
    return this.http.post('https://apinode1.secutrak.in/dev-app-secutrak/userVehicleListV3', val);
    // return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/userVehicleListV3', val);
  }
  test(val: any) {
    return this.http.post('http://localhost:3000/api/users/search', val);
  }
  MAP_1(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2New', val);
    //  return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2Home',val);

  }
  geofence_list(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/geofenceListV2', val);
  }
  MAP(val: any) {
    // return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2New',val);
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2', val);
    // http://uat.api.secutrak.in/dev-app-itraceit/vehicleTrackV2
  }
  save_geofence(val: any) {
    // return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2New',val);
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/geofenceAddV2', val);
    // http://uat.api.secutrak.in/dev-app-itraceit/vehicleTrackV2
  }
  landmarkList(val: any) {
    // return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2New',val);
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/landmarkListV2', val);
    // http://uat.api.secutrak.in/dev-app-itraceit/vehicleTrackV2
  }
  Landmark_add(val: any) {
    return this.http.post('https://api.secutrak.in/dev-app-secutrak/landmarkAddV2', val);
  }
  Landmark_type(val: any) {
    return this.http.post('https://api.secutrak.in/dev-app-secutrak/landmarkTypeListV2', val);
  }
  Lastlocation(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleLastLocationV2', val);
  }
  vehicleStatusTypes(val: any) {

    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleStatusTypes', val);
  }
  Filter(val: any) {
    return this.http.post(' https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleFiltersV2', val);
  }
  Vehicle_detail_pds(val: any) {
    return this.http.post('https://api.secutrak.in/dev-app-pds/userVehicleListV3', val);
  }
  vehicle_filter(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/userVehicleListV3', val);
  }
  polyline_full(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/polylineRoutesV2', val);
  }
  polyline_path(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/polylineClustersV2', val);
  }
  vehicle_report(val: any) {
    return this.http.post('https://api.secutrak.in/dev-app-secutrak/vehicleLastLocationV2', val);
  }
  liveAlert(val: any) {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/rm_searchAlertReport', val);
  }
  Driver_list(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/myDriversList', val);
  }
  live_tracking(val: any) {
    return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/liveDataV2', val);
  }
  ////////////////////elock//////////////////////
  getVehicleList(payload: any): Observable<any> {
    // using defaultUrl = true because full URL is provided
    return this.masterRequest.postFormData('https://api-secutrak.secutrak.in/dev-app-secutrak/userVehicleListV3', payload, true);
  }

  getTableData(payload: any): Observable<any> {
    return this.masterRequest.postFormData('https://apinode1.secutrak.in/dev-app-secutrak/report_angular', payload, true);
  }

  getImages(payload: any): Observable<any> {
    return this.masterRequest.postFormData('https://apinode1.secutrak.in/dev-app-secutrak/get_images', payload, true);
  }
}
