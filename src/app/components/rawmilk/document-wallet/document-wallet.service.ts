import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentWalletService {

  constructor(private masterRequest: MasterRequestService) { }

  getDocumentTypes(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_documentTypes', payload);
  }

  getCreateIndentMaster(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/createIndentMaster', payload);
  }

  getTankerFilter(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_tankerFilter', payload);
  }

  getVehicleListing(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_vdListing', payload);
  }

  getDocumentWalletRepo(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_documentWalletRepo', payload);
  }

  editDocument(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_editDocument', payload);
  }
}
