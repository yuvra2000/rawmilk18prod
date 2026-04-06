import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeciAddFormService {
  private http = inject(HttpClient);

  constructor() { }

  getLeciPreData(payload: FormData): Observable<any> {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/leciPreData', payload);
  }

  saveLeciData(payload: FormData): Observable<any> {
    return this.http.post('https://apinode1.secutrak.in/mobileApiDairyM/saveLeciData', payload);
  }
}
