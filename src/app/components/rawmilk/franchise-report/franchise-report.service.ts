import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FranchiseReportService {
  constructor(private masterRequestService: MasterRequestService) {}

  getListAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listAdda', params);
  }
  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  getListFranchiseReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(vehicleParams: any, listParams: any): Observable<any> {
    return forkJoin({
      addaList: this.getListAdda(listParams),
      franchiseList: this.getListFranchise(listParams),
    });
  }
}
