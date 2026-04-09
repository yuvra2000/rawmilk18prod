import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddaService {
  constructor(private masterRequestService: MasterRequestService) {}

  getListAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listAdda', params);
  }
  getListRegion(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listRegion', params);
  }

  editAdda(params: any): Observable<any> {
    console.log('edit adda params', params);
    return this.masterRequestService.postFormData('/editAdda', params);
  }
  addAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/addAdda', params);
  }

  initialData(params: any): Observable<any> {
    return forkJoin({
      addaList: this.getListAdda(params),
      regionList: this.getListRegion(params),
    });
  }
}
