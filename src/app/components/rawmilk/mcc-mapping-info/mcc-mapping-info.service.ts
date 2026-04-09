import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MasterService } from '../../../shared/services/master.service';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class MccMappingInfoService {
  constructor(
    private masterService: MasterService,
    private masterRequestService: MasterRequestService,
  ) {}

  // Get MCC mapping report data for the grid
  getMCCMappingReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/rm_mccMappingReport',
      params,
    );
  }
  createMCCMapping(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/rm_createMccMapping',
      params,
    );
  }

  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      masterOptions: this.masterService.getCreateIndentMaster(masterParams),
      reportData: this.getMCCMappingReport(reportParams),
    });
  }
}
