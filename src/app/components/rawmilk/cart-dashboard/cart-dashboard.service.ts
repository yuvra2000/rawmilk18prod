import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartDashboardService {
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
  getDashReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/cartDashboard', params);
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(reportParams: any, listParams: any): Observable<any> {
    return forkJoin({
      dashboardData: this.getDashReport(reportParams),
      addaList: this.getListAdda(listParams),
      franchiseList: this.getListFranchise(listParams),
    });
  }
}
