import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class TankerWiseTripReportService {

  constructor(private masterRequestService: MasterRequestService) { }

  getTankerName(payload: any) {
    return this.masterRequestService.post('/rm_tankerFilter', payload);
  }

  getPlantName(payload: any) {
    return this.masterRequestService.post('/createIndentMaster', payload);
  }

  getMccName(payload: any) {
    return this.masterRequestService.post('/get_mcc', payload);
  }

  getTableData(payload: any, detailedReport: boolean = false) {
    if (detailedReport) {
      return this.masterRequestService.postFormData('/rm_tankDetailRepo', payload);
    } else {
      return this.masterRequestService.postFormData('/rm_tankerIReport', payload);
    }
  }
}
