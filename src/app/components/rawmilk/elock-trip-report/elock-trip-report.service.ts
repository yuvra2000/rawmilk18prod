import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElockTripReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getVehicleList(payload: any): Observable<any> {
    // using defaultUrl = true because full URL is provided
    return this.masterRequest.postFormData('https://api-secutrak.secutrak.in/dev-app-secutrak/userVehicleListV3', payload, true);
  }

  getTableData(payload: any): Observable<any> {
    return this.masterRequest.postFormData('https://dairybeta.secutrak.in/elock/report_angular', payload, true);
  }
}
