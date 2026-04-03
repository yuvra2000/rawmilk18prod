import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { MasterRequestService } from '../master-request.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private masterRequestService: MasterRequestService) {}

  /**
   * Get inventory report data
   */
  getInventoryReport(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/rm_inventoryReport`,
      params,
    );
  }

  /**
   * Get MCC/BMC data for dropdown options
   */
  getMCCData(params: any): Observable<any> {
    return this.masterRequestService.postFormData(`/get_mcc`, params);
  }

  /**
   * Get master data for filter dropdowns (createIndentMaster contains milk types, plants, etc.)
   */
  getCreateIndentMaster(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/createIndentMaster`,
      params,
    );
  }
  createInventory(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      '/rm_createInventory',
      params,
    );
  }
  /**
   * Get all filter options using forkJoin for parallel API calls
   * This fetches MCC data and master data simultaneously for better performance
   */
  getFilterOptions(params: any): Observable<any> {
    return forkJoin({
      mccData: this.getMCCData(params),
      masterData: this.getCreateIndentMaster(params),
    });
  }

  /**
   * Delete inventory item
   */
  deleteInventory(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/rm_deleteInventory`, // Adjust endpoint as per your API
      params,
    );
  }
  updateInventory(params: any): Observable<any> {
    return this.masterRequestService.postFormData(
      `/rm_editInventory`, // Adjust endpoint as per your API
      params,
    );
  }
  /**
   * Initialize page data - fetches all required data in parallel
   * Use this when component loads to get both filter options and initial inventory data
   */
  initializePageData(filterParams: any, reportParams: any): Observable<any> {
    return forkJoin({
      filterOptions: this.getFilterOptions(filterParams),
      inventoryData: this.getInventoryReport(reportParams),
    });
  }
}
