import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class LeciDashboardService {

  constructor(private masterRequest: MasterRequestService) {}

  getIndentMasterData(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getTankerFilter(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_tankerFilter', payload);
  }

  getFilterDropdowns(indentPayload: FormData, tankerPayload: FormData): Observable<any> {
    return forkJoin({
      indentMaster: this.getIndentMasterData(indentPayload),
      tankerFilter: this.getTankerFilter(tankerPayload),
    });
  }

  getLeciDashboardData(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/leciDashboard', payload);
  }
}
