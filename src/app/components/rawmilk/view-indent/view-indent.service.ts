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
    console.log('Fetching indent data with params:', params);
    return this.masterRequestService.post(`/pendingIndentProc`, params);
  }
  updateData(data: any) {
    return this.masterRequestService.post(`/editIndent`, data);
  }
  getCreateIndentDataMilkAndPlantSupplier(params: any) {
    return this.masterRequestService.post(`/createIndentMaster`, params);
  }
  closeIntent(params: any) {
    return this.masterRequestService.post(`/closeIndent`, params);
  }
  createIntent(params: any, type: 'form' | 'upload') {
    const endpoint = type === 'form' ? 'createIntentt' : 'createIntentUploadd';
    return this.masterRequestService.postFormData(`/${endpoint}`, params);
  }
  getMCCData(params: any) {
    return this.masterRequestService.post(`/get_mcc`, params);
  }
}
