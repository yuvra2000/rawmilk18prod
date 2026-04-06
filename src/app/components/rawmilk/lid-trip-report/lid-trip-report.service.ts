import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class LidTripReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getIndentMasterDetails(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getLidTripReport(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_LidReport', payload);
  }
}
