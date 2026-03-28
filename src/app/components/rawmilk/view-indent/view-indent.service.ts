import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class ViewIndentService {
  constructor(private masterRequestService: MasterRequestService) {}
  getIndentData(params: any) {
    return this.masterRequestService.postFormData(`/pendingIndentProc`, params);
  }
  updateData(data: any) {
    return this.masterRequestService.postFormData(`/editIndent`, data);
  }
  getCreateIndentDataMilkAndPlantSupplier(params: any) {
    return this.masterRequestService.postFormData(
      `/createIndentMaster`,
      params,
    );
  }
  closeIntent(params: any) {
    return this.masterRequestService.postFormData(`/closeIndent`, params);
  }
  createIntent(params: any, type: 'form' | 'upload') {
    const endpoint = type === 'form' ? 'createIntentt' : 'createIntentUploadd';
    return this.masterRequestService.postFormData(`/${endpoint}`, params);
  }
  getMCCData(params: any) {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }
}
