import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeciReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getIndentMasterData(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getLeciReport(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_leciReport', payload);
  }

  sendEmail(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_sendMail', payload);
  }
}
