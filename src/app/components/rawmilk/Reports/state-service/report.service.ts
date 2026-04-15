import { MasterRequestService } from '../../master-request.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root', // 🔥 THIS FIXES YOUR ERROR
})
export class ReportService {
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
  getMccData(params: any) {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }
  getDispatchPrefetch(params: any) {
    return this.masterRequestService.postFormData(`/createDispatchPre`, params);
  }
  getvehicle(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/userVehicleListV3`,
      params,
      true,
    );
  }

  travelData(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/distanceReport`,
      params,
      true,
    );
  }
  Distancereport(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/travelReport`,
      params,
      true,
    );
  }
  monthlyreport(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/monthlyDistanceReport`,
      params,
      true,
    );
  }
  addressS1(params: any) {
    return this.masterRequestService.postFormData(
      `https://api-secutrak.secutrak.in/dev-app-secutrak/vehicleLastLocationV2`,
      params,
      true,
    );
  }
  //   createDispatch(params: any) {
  //     return this.masterRequestService.postFormData(`/createDispatch1`, params);
  //   }
  // createDirectDispatch(params: any) {
  //   return this.masterRequestService.postFormData(
  //     `/createDirectDispatch1`,
  //     params,
  //   );
  // }
}
