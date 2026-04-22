import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartWiseReportService {
  constructor(private masterRequestService: MasterRequestService) {}
  getCartWiseReportData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/cartWiseCartReport',
      params,
    );
  }
}
