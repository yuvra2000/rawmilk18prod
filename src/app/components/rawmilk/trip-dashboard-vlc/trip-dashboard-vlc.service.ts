import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class TripDashboardVlcService {

  constructor(private masterRequest: MasterRequestService) { }

  getTripDashboardTableData(payload: any){
    return this.masterRequest.postFormData('/milkCollection_dashboard', payload);
  }
}
