import { Injectable } from '@angular/core';
import { MasterService } from '../../../shared/services/master.service';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtaReportService {
  constructor(
    private masterService: MasterService,
    private masterRequestService: MasterRequestService,
  ) {}

  // Get ETA data for the grid
  getETAData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/productionETAReport',
      params,
    );
  }
  getBucketDetails(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/productionETAReportDetails',
      params,
    );
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      masterOptions: this.masterService.getCreateIndentMaster(masterParams),
      reportData: this.getETAData(reportParams),
    });
  }
}
