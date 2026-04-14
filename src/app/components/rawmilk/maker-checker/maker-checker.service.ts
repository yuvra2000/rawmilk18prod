import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class MakerCheckerService {
  constructor(private masterRequestService: MasterRequestService) {}

  // Get MCC mapping report data for the grid
  getUserList(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/usersList', params);
  }
  getMakerCheckerList(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/makerChecker', params);
  }
  assignMakerChecker(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/addMakerChecker', params);
  }
  deAssignMakerChecker(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/deassignMakerChecker',
      params,
    );
  }
  // Combined method using forkJoin for parallel API calls
  initializePageData(userParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      user: this.getUserList(userParams),
      checkerMaker: this.getMakerCheckerList(reportParams),
    });
  }
}
