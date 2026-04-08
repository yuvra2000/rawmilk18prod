import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MasterService } from '../../../shared/services/master.service';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class DispatchPlanningService {
  constructor(
    private masterService: MasterService,
    private masterRequestService: MasterRequestService,
  ) {}

  // Get production planning data for the grid
  getProductionPlanningData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/productionPlanningData',
      params,
    );
  }

  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      masterOptions: this.masterService.getCreateIndentMaster(masterParams),
      reportData: this.getProductionPlanningData(reportParams),
    });
  }
  deleteDispatch(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/deleteProductionData',
      params,
    );
  }
  divertDispatch(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/divertProductionn', params);
  }
}
