import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartReportService {
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
  getListAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listAdda', params);
  }
  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  getCartReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/cartReport', params);
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(vehicleParams: any, listParams: any): Observable<any> {
    return forkJoin({
      vehicleList: this.getVehicleList(vehicleParams),
      addaList: this.getListAdda(listParams),
      franchiseList: this.getListFranchise(listParams),
    });
  }
}
