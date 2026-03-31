import { Injectable } from '@angular/core';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class AllocatedIndentService {
  constructor(private masterRequestService: MasterRequestService) {}
  viewAllocate(val: any) {
    // return this.http.post(this.Nurl + 'viewAllocationProc', val);
    return this.masterRequestService.postFormData('/viewAllocationProc', val);
  }
  getMCCData(params: any) {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }
  deleteSubIndent(params: any) {
    return this.masterRequestService.postFormData(`/deleteSubIndentt`, params);
  }
  Allocate(params: any) {
    return this.masterRequestService.postFormData(
      `/allocateIndentProcc`,
      params,
    );
  }
  editAllocate(params: any) {
    return this.masterRequestService.postFormData(
      `/editIndentAllocationProcc`,
      params,
    );
  }
}
