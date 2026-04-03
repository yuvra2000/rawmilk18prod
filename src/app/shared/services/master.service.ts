import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterRequestService } from '../../components/rawmilk/master-request.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private masterRequestService: MasterRequestService) {}

  getMCCData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }
  getCreateIndentMaster(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/createIndentMaster`,
      params,
    );
  }
}
