import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectionService {
  constructor(private masterRequestService: MasterRequestService) {}
  /**
   * Get MCC/BMC data for dropdown options
   */
  getMCCData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }

  /**
   * Get master data for filter dropdowns (createIndentMaster contains milk types, plants, etc.)
   */
  getCreateIndentMaster(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/createIndentMaster`,
      params,
    );
  }
  /**
   * Get projection report data
   */
  getProjectionReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/rm_projectionReport`,
      params,
    );
  }
  initializePageData(
    mccParams: any,
    masterParams: any,
    reportParams: any,
  ): Observable<any> {
    return forkJoin({
      mccOptions: this.getMCCData(mccParams),
      masterOptions: this.getCreateIndentMaster(masterParams),
      inventoryData: this.getProjectionReport(reportParams),
    });
  }
}
