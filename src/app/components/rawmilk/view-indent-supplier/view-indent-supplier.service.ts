import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class ViewIndentSupplierService {
  constructor(private masterRequestService: MasterRequestService) {}
  getIndentData(params: any) {
    return this.masterRequestService.postFormData(`/pendingIndentProc`, params);
  }
}
