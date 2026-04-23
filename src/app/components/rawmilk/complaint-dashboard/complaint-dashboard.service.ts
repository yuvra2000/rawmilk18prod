import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComplaintDashboardService {
  constructor(private masterRequestService: MasterRequestService) {}
  getAddaWiseReportData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/addaWiseCartReport',
      params,
    );
  }
  initialData(params: any): Observable<any> {
    return forkJoin({
      addaList: this.masterRequestService.postFormData('/addaList', params),
      // regionList: this.masterRequestService.postFormData('/regionList', params),
    });
  }
}
