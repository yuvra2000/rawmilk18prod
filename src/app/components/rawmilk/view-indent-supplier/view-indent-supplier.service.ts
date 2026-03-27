import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ViewIndentSupplierService {
  constructor(private http: HttpClient) {}
  getIndentData(params: any) {
    return this.http.post(`${environment.BASE_URL}/pendingIndentProc`, params);
  }
}
