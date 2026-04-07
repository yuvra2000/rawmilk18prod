import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class LoadPlanningService {

  constructor(private masterRequest: MasterRequestService) { }

  getCreateIndentMaster(payload: any): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getRmTankerFilter(payload: any): Observable<any> {
    return this.masterRequest.postFormData('/rm_tankerFilter', payload);
  }

  getLoadPlanningRepo(payload: any): Observable<any> {
    return this.masterRequest.postFormData('/rm_LoadPlanningRepo', payload);
  }

  getFilterOptions(indentPayload: any, tankerPayload: any): Observable<any> {
    return forkJoin({
      indentMaster: this.getCreateIndentMaster(indentPayload),
      tankerFilter: this.getRmTankerFilter(tankerPayload)
    });
  }
}
