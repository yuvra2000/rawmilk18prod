import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlacklistService {
  constructor(private masterRequestService: MasterRequestService) {}

  TankerVehicleListAndTransporter(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/rm_tankerFilter', params);
  }
  createIndentMaster(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/createIndentMaster',
      params,
    );
  }
  vehicleWiseReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/vehicleListVehicleWisee',
      params,
    );
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, tankerParams: any): Observable<any> {
    return forkJoin({
      tankerTranspList: this.TankerVehicleListAndTransporter(tankerParams),
    });
  }
}
