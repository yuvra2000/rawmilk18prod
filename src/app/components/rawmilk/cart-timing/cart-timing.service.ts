import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartTimingService {
  constructor(private masterRequestService: MasterRequestService) {}

  getListAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listAdda', params);
  }
  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  getListCartTiming(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/listAddaCartTiming',
      params,
    );
  }

  editAddaCartTiming(params: any): Observable<any> {
    console.log('edit adda params', params);
    return this.masterRequestService.postFormData(
      '/editAddaCartTiming',
      params,
    );
  }
  addAddaCartTimingBeta(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/addAddaCartTimingBeta',
      params,
    );
  }

  initialData(params: any): Observable<any> {
    return forkJoin({
      addaList: this.getListAdda(params),
      franchiseList: this.getListFranchise(params),
      cartTimingData: this.getListCartTiming(params),
    });
  }
}
