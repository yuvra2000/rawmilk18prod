import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root'
})
export class AlertReportService {

  constructor(private masterRequestService: MasterRequestService) { }

  getMpcName(payload: any) {
    return this.masterRequestService.post('/createIndentMaster', payload);
  }
}
