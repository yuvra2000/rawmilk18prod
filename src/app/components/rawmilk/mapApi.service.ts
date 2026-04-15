import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from './master-request.service';
// import { MasterRequestService } from '../../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class mapApiService {
  constructor(private masterRequestService: MasterRequestService) {}

  //   getMccData(params: any) {
  //     return this.masterRequestService.postFormData(`/get_mcc`, params);
  //   }
  //   tripdata(params: any) {
  //     return this.masterRequestService.post(`/tripDashboard`, params);
  //   }
  vehicleTrackingV2New(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleTrackingV2New`,
      params,
      true,
    );
  }
  alertservice(params: any) {
    return this.masterRequestService.postFormData(
      `/rm_searchAlertReport`,
      params,
    );
  }
}
