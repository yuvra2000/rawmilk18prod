import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartMappingService {
  constructor(private masterRequestService: MasterRequestService) {}

  getListCart(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/userVehicleListV3',
      params,
      false,
      true,
    );
  }
  getListFranchise(params: any): Observable<any> {
    return this.masterRequestService.postFormData('/listFranchise', params);
  }
  listFranchiseCartAssignment(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/listFranchiseCartAssignment',
      params,
    );
  }
  franchiseCartAssignment(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/franchiseCartAssignment',
      params,
    );
  }
  assignDeAssign(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/editFranchiseCartAssignment',
      params,
    );
  }
  initialData(params: any, cartParams: any): Observable<any> {
    return forkJoin({
      cartList: this.getListCart(cartParams),
      franchiseList: this.getListFranchise(params),
      cartMappingList: this.listFranchiseCartAssignment(params),
    });
  }
}
