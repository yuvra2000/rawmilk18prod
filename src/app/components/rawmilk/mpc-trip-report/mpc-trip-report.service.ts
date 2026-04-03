import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MpcTripReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getIndentMasterDetails(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getMpcTripReport(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData(
      'https://apinode1.secutrak.in/mobileApiDairyM/rm_mpcTReport',
      payload,
      true,
    );
  }
}
