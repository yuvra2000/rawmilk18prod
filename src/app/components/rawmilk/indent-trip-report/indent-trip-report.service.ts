import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MasterRequestService } from '../master-request.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Injectable({
  providedIn: 'root'
})
export class IndentTripReportService {

  constructor(private masterRequest: MasterRequestService) { }

  getFilterOptions(): Observable<any> {
    const token = localStorage.getItem('AccessToken') || '';
    const groupId = localStorage.getItem('GroupId') || '';
    
    const formData = createFormData(token, {
      GroupId: groupId,
      ForApp: '0',
    });

    return this.masterRequest.postFormData('/createIndentMaster', formData);
  }

  getIndentTripReport(payload: FormData): Observable<any> {
    return this.masterRequest.postFormData('/rm_indentTReport', payload);
  }
}
