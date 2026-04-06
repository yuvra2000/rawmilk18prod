import { Injectable } from '@angular/core';
import { MasterService } from '../../../shared/services/master.service';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchPlanningService {
  constructor(
    private masterService: MasterService,
    private masterRequestService: MasterRequestService,
  ) {}

  // Get tanker filter data for the grid
  getTankerFilter(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/rm_tankerFilter', params);
  }
  submitDispatchPlan(formdata: FormData): Observable<any> {
    return this.masterRequestService.postFormData(
      '/saveProductionDataa',
      formdata,
    );
  }
  uploadDispatchExcel(formdata: FormData): Observable<any> {
    return this.masterRequestService.postFormData(
      '/productionExcelRead',
      formdata,
    );
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(masterParams: any, tankerParams: any): Observable<any> {
    return forkJoin({
      masterOptions: this.masterService.getCreateIndentMaster(masterParams),
      tankerFilter: this.getTankerFilter(tankerParams),
    });
  }
}
