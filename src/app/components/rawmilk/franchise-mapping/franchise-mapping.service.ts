import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FranchiseMappingService {
  constructor(private masterRequestService: MasterRequestService) {}
  getListAdda(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listAdda', params);
  }
  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  getMappingList(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/listFranchiseAssignment',
      params,
    );
  }
  addFranchiseAssignment(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/addFranchiseAssignment',
      params,
    );
  }
  assignDeAssign(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/editFranchiseAssignment',
      params,
    );
  }
  initialData(params: any): Observable<any> {
    return forkJoin({
      addaList: this.getListAdda(params),
      franchiseList: this.getListFranchise(params),
      franchiseMappingList: this.getMappingList(params),
    });
  }
}
