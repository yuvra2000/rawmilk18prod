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
}
