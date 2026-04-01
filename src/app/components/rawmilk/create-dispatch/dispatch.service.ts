import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  constructor(private masterRequestService: MasterRequestService) {}

  getCreateIndentDataMilkAndPlantSupplier(params: any) {
    return this.masterRequestService.postFormData(
      `/createIndentMaster`,
      params,
    );
  }
  getVehicleData(params: any) {
    return this.masterRequestService.postFormData(`/rm_tankerFilter`, params);
  }
}
