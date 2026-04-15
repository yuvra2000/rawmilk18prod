import { computed, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { addParams, createMasterParams, editParams } from './utils';
import {
  handleApiResponse,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { franchiseColumns, addFields, editFields } from './config';
import { AlertService } from '../../../../shared/services/alert.service';
import { FranchiseService } from '../franchise.service';
interface InitialData {
  franchiseList: any[];
}
export class FranchiseStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modal = inject(UniversalModalService);
  private franchiseService = inject(FranchiseService);
  private alertService = inject(AlertService);
  loading = signal(false);
  rowData = computed(() => this.initialData().franchiseList || []);
  initialData = signal<InitialData>({
    franchiseList: [],
  });
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: franchiseColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    isFitGridWidth: true,
  }));
  async loadInitialData() {
    try {
      this.loading.set(true);
      this.spinner.show();
      const params = createMasterParams();
      const res: any = await firstValueFrom(
        this.franchiseService.getListFranchise(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      this.initialData.set({
        franchiseList: res.Data || [],
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  onEdit(data: any) {
    console.log('Edit data', data);
    this.modal.openForm({
      title: 'Edit Franchise',
      mode: 'form',
      fields: editFields(),
      initialData: {
        ...data,
        status: data.status === 1 ? 'Active' : 'Deactive',
      },
      onSave: async (formData: any) => {
        await this.saveForm(formData, data, 'edit');
      },
    });
  }

  async saveForm(formData: any, data: any, type: 'edit' | 'add') {
    if (type == 'edit') {
      const isConfirmed = await this.alertService.confirmEdit(
        'Do you want to edit this Adda?',
        'Your changes will be updated.',
        'Yes, update it!',
        'Cancel',
      );
      if (!isConfirmed) {
        throw new Error('Edit cancelled');
      }
    }
    const payload =
      type == 'edit' ? editParams(data, formData) : addParams(formData);
    try {
      this.spinner.show();
      this.loading.set(true);
      const res: any = await firstValueFrom(
        type == 'edit'
          ? this.franchiseService.editFranchise(payload)
          : this.franchiseService.addFranchise(payload),
      );

      const isSuccess = handleApiResponse(res, this.toast);
      if (!isSuccess) {
        this.toast.error('Failed to update Adda');
      }
      await this.loadInitialData();
    } catch (error: any) {
      if (error?.error?.message) {
        this.toast.error(error.error.message || 'Something went wrong');
      }
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  addAdda() {
    this.modal.openForm({
      title: 'Add Franchise',
      mode: 'form',
      fields: addFields(),
      onSave: async (formData: any) => {
        await this.saveForm(formData, null, 'add');
      },
    });
  }
}
