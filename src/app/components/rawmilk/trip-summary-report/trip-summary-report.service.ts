import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class TripSummaryReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getTankerFilter(params: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_tankerFilter', params);
  }

  getCreateIndentMaster(params: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', params);
  }

  getMcc(params: FormData): Observable<any> {
    return this.masterRequest.postFormData('/get_mcc', params);
  }

  getFilterOptions(authParams: any): Observable<any> {
    const tankerParams = new FormData();
    tankerParams.append('AccessToken', authParams.AccessToken);
    tankerParams.append('ForWeb', '1');

    const mpcPlantParams = new FormData();
    mpcPlantParams.append('AccessToken', authParams.AccessToken);
    mpcPlantParams.append('GroupId', authParams.GroupId);
    mpcPlantParams.append('ForApp', '0');

    const mccParams = new FormData();
    mccParams.append('AccessToken', authParams.AccessToken);
    mccParams.append('GroupId', authParams.GroupId);
    mccParams.append('ForApp', '0');
    // Mcc uses supplier_id

    return forkJoin({
      tankerData: this.getTankerFilter(tankerParams),
      masterData: this.getCreateIndentMaster(mpcPlantParams),
      mccData: this.getMcc(mccParams)
    });
  }
}

