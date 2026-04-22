import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddaWiseReportService {
  constructor(private masterRequestService: MasterRequestService) {}
  getAddaWiseReportData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/addaWiseCartReport',
      params,
    );
  }
}
