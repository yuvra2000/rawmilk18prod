import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
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

  getTripSummaryReport(params: FormData): Observable<any> {
    return this.masterRequest.postFormData('/tripSummary', params);
  }

  getFilterOptions(tankerParams: FormData, mpcPlantParams: FormData, mccParams: FormData): Observable<any> {
    // Calling sequentially to avoid 502 errors from concurrent requests
    return this.getTankerFilter(tankerParams).pipe(
      concatMap((tankerData) => 
        this.getCreateIndentMaster(mpcPlantParams).pipe(
          concatMap((masterData) => 
            this.getMcc(mccParams).pipe(
              map((mccData) => ({
                tankerData,
                masterData,
                mccData
              }))
            )
          )
        )
      )
    );
  }
}


