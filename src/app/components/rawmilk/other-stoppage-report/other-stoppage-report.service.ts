import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtherStoppageReportService {
  constructor(private masterRequestService: MasterRequestService) {}

  getReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/cartReport', params);
  }
  getVehicleList(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/userVehicleListV3',
      params,
      false,
      true,
    );
  }
}
