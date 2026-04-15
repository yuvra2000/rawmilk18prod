import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FranchiseService {
  constructor(private masterRequestService: MasterRequestService) {}

  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }

  editFranchise(params: any): Observable<any> {
    console.log('edit Franchise params', params);
    return this.masterRequestService.postFormData('/editFranchise', params);
  }
  addFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/addFranchise', params);
  }
}
