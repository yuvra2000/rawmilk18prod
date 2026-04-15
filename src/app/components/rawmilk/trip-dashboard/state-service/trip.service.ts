import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from '../../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private masterRequestService: MasterRequestService) {}

  getMccData(params: any) {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }
  tripdata(params: any) {
    return this.masterRequestService.postFormData(`/tripDashboard`, params);
  }
  elockonclick(params: any) {
    return this.masterRequestService.postFormData(
      `https://dairybeta.secutrak.in/elock/report_angular`,
      params,
      true,
    );
  }
}
