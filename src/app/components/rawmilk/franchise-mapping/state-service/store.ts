import { computed, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { addParams, createMasterParams, editParams } from './utils';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { franchiseMappingColumns, addFields, editFields } from './config';
import { AlertService } from '../../../../shared/services/alert.service';
import { FranchiseMappingService } from '../franchise-mapping.service';
interface InitialData {
  addaList: any[];
  franchiseList?: any[];
  franchiseMappingList?: any[];
}
export class FranchiseMappingStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modal = inject(UniversalModalService);
  private franchiseMapppingService = inject(FranchiseMappingService);
  private alertService = inject(AlertService);
  rowData = computed(() => this.initialData().franchiseMappingList || []);
  initialData = signal<InitialData>({
    addaList: [],
    franchiseList: [],
    franchiseMappingList: [],
  });
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: franchiseMappingColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    enableRowSelection: true,
    rowSelectionMode: 'multiple',
  }));
  async loadInitialData() {
    try {
      this.spinner.show();
      const params = createMasterParams();
      const res: any = await firstValueFrom(
        this.franchiseMapppingService.initialData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res?.addaList, this.toast);
      handleApiResponse(res?.franchiseList, this.toast);
      handleApiResponse(res?.franchiseMappingList, this.toast);
      this.initialData.set({
        addaList: res.addaList?.Data || [],
        franchiseList: res.franchiseList?.Data || [],
        franchiseMappingList: res.franchiseMappingList?.Data || [],
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.spinner.hide();
    }
  }
  onRowSelection(event: any) {
    console.log('Selected Rows:', event);
  }
}
