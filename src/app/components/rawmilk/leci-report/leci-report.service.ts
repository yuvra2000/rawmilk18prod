import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeciReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getIndentMasterData(payload: FormData): Observable<any> {
    return this.masterRequest.post('/createIndentMaster', payload);
  }

  getLeciReport(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('https://apinode1.secutrak.in/mobileApiDairyM/rm_leciReport', payload, true);
  }
}
