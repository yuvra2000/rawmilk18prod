import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

export interface BaseApiResponse {
  Status: string;
  Message: string;
}

export interface MpcNameResponse extends BaseApiResponse {
  PlantSupplier: any[];
}

export interface AlertData {
  [key: string]: any;
}

export interface AlertReportResponse extends BaseApiResponse {
  Data: AlertData[];
}

@Injectable({
  providedIn: 'root'
})
export class AlertReportService {

  constructor(private masterRequestService: MasterRequestService) { }

  getMpcName(payload: any): Observable<MpcNameResponse> {
    return this.masterRequestService.post<MpcNameResponse>('/createIndentMaster', payload);
  }

  getTableData(payload: any): Observable<AlertReportResponse> {
    return this.masterRequestService.post<AlertReportResponse>('/rm_searchAlertReport', payload);
  }
}
