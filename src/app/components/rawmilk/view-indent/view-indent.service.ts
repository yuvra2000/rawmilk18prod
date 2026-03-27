import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewIndentService {
  constructor(private http: HttpClient) {}
  getIndentData(params: any) {
    return this.http.post(`${environment.BASE_URL}/pendingIndentProc`, params);
  }
  updateData(data: any) {
    return this.http.post(`${environment.BASE_URL}/editIndent`, data);
  }
  getCreateIndentDataMilkAndPlantSupplier(params: any) {
    return this.http.post(`${environment.BASE_URL}/createIndentMaster`, params);
  }
  closeIntent(params: any) {
    return this.http.post(`${environment.BASE_URL}/closeIndent`, params);
  }
  createIntent(params: any, type: 'form' | 'upload') {
    const endpoint = type === 'form' ? 'createIntentt' : 'createIntentUploadd';
    return this.http.post(`${environment.BASE_URL}/${endpoint}`, params);
  }
  getMCCData(params: any) {
    return this.http.post(`${environment.BASE_URL}/get_mcc`, params);
  }
}
