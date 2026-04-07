import { Injectable } from '@angular/core';
import { MasterService } from '../../../shared/services/master.service';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummarizedReportService {
  constructor(
    private masterService: MasterService,
    private masterRequestService: MasterRequestService,
  ) {}

  // Get summarized report data for the grid
  getSummarizedReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/summarizedReport', params);
  }
  getSummarizedReportDetails(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/productionPlanningData',
      params,
    );
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      masterOptions: this.masterService.getCreateIndentMaster(masterParams),
      reportData: this.getSummarizedReport(reportParams),
    });
  }
}
