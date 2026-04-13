import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from '../../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class HaltReportService {
  constructor(private masterRequestService: MasterRequestService) {}
  // Get summarized report data for the grid
  getVehicleList(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/userVehicleListV3',
      params,
      false,
      true,
    );
  }
  getGeoFenceList(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/geofenceListV2',
      params,
      false,
      true,
    );
  }
  getHaltReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      'https://www.secutrak.in/reports/halt_report_angular',
      params,
      true,
      false,
    );
  }
  initializePageData(params: any): Observable<any> {
    return forkJoin({
      vehicleList: this.getVehicleList(params),
      geofenceList: this.getGeoFenceList(params),
    });
  }
}
