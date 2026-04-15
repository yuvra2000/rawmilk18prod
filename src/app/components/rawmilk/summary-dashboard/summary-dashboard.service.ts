import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryDashboardService {

  constructor(private http: HttpClient) { }

  getCreateIndentMaster(payload: any): Observable<any> {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/createIndentMaster', payload);
  }

  getDeliveryDashboard(payload: any): Observable<any> {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/rm_deliveryDashboard', payload);
  }

  getDeliveryQtyPopup(payload: any): Observable<any> {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/rm_deliverQtyPopup', payload);
  }
}
