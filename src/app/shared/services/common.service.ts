import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
@Injectable({ providedIn: 'root' })
export class commonService {
  updateRouteFleet(formdata: FormData) {
    throw new Error('Method not implemented.');
  }
  private httpClient = inject(HttpClientService);
  private baseurl = this.httpClient.getEndpoint('HomeBase');
  private bdeItraceit = this.httpClient.getEndpoint('bdeItraceit');
  private base = this.httpClient.getEndpoint('base');
  vehicleTrackingV2New(params: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseurl}/vehicleTrackingV2New`,
      params,
    );
  }
  triggerHistoryAT(params: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.bdeItraceit}/triggerHistoryAT`,
      params,
    );
  }

  distanceTimeline(params: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseurl}/distanceTimeline`,
      params,
    );
  }
  vehicleLastLocationV3(params: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.bdeItraceit}/vehicleLastLocationV3`,
      params,
    );
  }
  liveData(params: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseurl}/liveDataV2`, params);
  }
  getCustomerDetails(params: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.base}/bdTripCustomerDetails`,
      params,
    );
  }
}
