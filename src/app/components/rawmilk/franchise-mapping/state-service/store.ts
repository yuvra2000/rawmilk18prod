import { computed, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { addParams, createMasterParams } from './utils';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { franchiseMappingColumns, addFranchiseFields } from './config';
import { AlertService } from '../../../../shared/services/alert.service';
import { FranchiseMappingService } from '../franchise-mapping.service';
import { ActionButtonData } from '../../../../shared/components/action-button/action-button.component';
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
  selectedRows = signal<any[]>([]);
  loading = signal(false);
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
    isFitGridWidth: true,
  }));
  async loadInitialData() {
    try {
      this.loading.set(true);

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
        addaList:
          res.addaList?.Data?.map((a: any) => ({ ...a, id: a.code })) || [],
        franchiseList:
          res.franchiseList?.Data?.map((f: any) => ({ ...f, id: f.code })) ||
          [],
        franchiseMappingList: res.franchiseMappingList?.Data || [],
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  onRowSelection(event: any) {
    this.selectedRows.set(event);
  }
  handleButtonAction(actionData: ActionButtonData): void {
    switch (actionData.action) {
      case 'assign-franchise':
        this.assignFranchise();
        break;
      case 'assign':
        this.assignDe(actionData.data, 1);
        break;
      case 'de-assign':
        this.assignDe(actionData.data, 2);
        break;
      default:
        console.warn('Unhandled action:', actionData.action);
    }
  }
  assignFranchise() {
    this.modal.openForm({
      title: 'Assign Franchise',
      fields: addFranchiseFields(
        this.initialData().franchiseList || [],
        this.initialData().addaList || [],
      ),
      mode: 'form',
      onSave: async (formData: any) => {
        await this.saveAssignFranchise(formData);
      },
    });
  }
  async saveAssignFranchise(formData: any) {
    const params = addParams(formData);
    this.spinner.show();
    try {
      this.loading.set(true);
      const res: any = await firstValueFrom(
        this.franchiseMapppingService.addFranchiseAssignment(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res, this.toast);
      this.toast.success('Franchise assigned successfully');
      this.loadInitialData();
    } catch (error) {
      this.toast.error('Failed to assign franchise');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  assignDe(data: any, type: number) {
    const title = type == 1 ? 'Assign Franchise' : 'De-Assign Franchise';
    const text =
      type == 1
        ? 'Are you sure you want to assign selected franchises?'
        : 'Are you sure you want to de-assign selected franchises?';
    this.alertService.confirmQuestion(title, text).then((confirmed) => {
      if (confirmed) {
        this.saveAssignDe(data, type);
      }
    });
  }
  async saveAssignDe(data: any, type: number) {
    const params = createFormData(token, {
      status: String(type),
      id: JSON.stringify(data.selectedRows.map((r: any) => r._id.$oid)),
    });
    this.spinner.show();
    try {
      this.loading.set(true);
      const res: any = await firstValueFrom(
        this.franchiseMapppingService.assignDeAssign(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res, this.toast);
      this.toast.success(
        `Franchise ${type == 1 ? 'assigned' : 'de-assigned'} successfully`,
      );
      this.loadInitialData();
    } catch (error: any) {
      this.toast.error(
        error?.error?.message ||
          `Failed to ${type == 1 ? 'assign' : 'de-assign'} franchise`,
      );
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
