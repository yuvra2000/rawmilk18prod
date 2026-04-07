import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteLockUnlockService {
  private masterRequest = inject(MasterRequestService);

  /**
   * Fetch tanker/vehicle list for dropdown
   * @param token Access token
   */
  getTankerList(token: string): Observable<any> {
    const payload = {
      AccessToken: token,
      singleVehicle: 1,
    };
    const endpoint = 'https://apinode1.secutrak.in/dev-app-secutrak/userVehicleListV3';
    return this.masterRequest.post(endpoint, payload, true);
  }

  /**
   * Lock or unlock remote device
   * @param token Access token
   * @param lockStatus '1' for lock, '0' for unlock
   * @param imei Device IMEI number
   */
  remoteLockUnlock(token: string, lockStatus: string, imei: string): Observable<any> {
    const payload = {
      lock_status: lockStatus,
      AccessToken: token,
      imei: imei,
      Json: '1',
      requestFor: '2',
      ForWeb: '1',
    };
    const endpoint = 'https://apinode1.secutrak.in/mobileApiDairyM/remoteLU';
    return this.masterRequest.post(endpoint, payload, true);
  }
}
