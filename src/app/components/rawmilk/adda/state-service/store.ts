import { computed, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { AddaService } from '../adda.service';
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
import { addaColumns, addFields, editFields } from './config';
import { AlertService } from '../../../../shared/services/alert.service';
interface InitialData {
  addaList: any[];
  regionList?: any[];
}
export class AddaStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modal = inject(UniversalModalService);
  private addaService = inject(AddaService);
  private alertService = inject(AlertService);
  rowData = computed(() => this.initialData().addaList || []);
  initialData = signal<InitialData>({
    addaList: [],
    regionList: [],
  });
  loading = signal(false);
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: addaColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
  }));
  async loadInitialData() {
    try {
      this.spinner.show();
      this.loading.set(true);
      const params = createMasterParams();
      const res: any = await firstValueFrom(
        this.addaService.initialData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(
        res?.addaList,
        this.toast,
        undefined,
        'Failed to load Adda list',
        '',
      );
      handleApiResponse(
        res?.regionList,
        this.toast,
        undefined,
        'Failed to load Region list',
        '',
      );
      this.initialData.set({
        addaList: res.addaList?.Data || [],
        regionList:
          res.regionList?.Data?.map((r: any) => ({
            ...r,
            name: r.zone_code,
            id: r.zone_code,
          })) || [],
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
      title: 'Edit Adda',
      mode: 'form',
      fields: editFields(this.initialData().regionList || []),
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
    console.log('Form Data from saveform', formData);
    const latlng = (formData?.latlng ?? formData?.geoCord ?? '').trim();
    const latLngRegex =
      /^-?(?:90(?:\.0+)?|[1-8]?\d(?:\.\d+)?),\s*-?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|\d{1,2}(?:\.\d+)?)$/;
    if (!latLngRegex.test(latlng)) {
      throw new Error('Invalid Geo Coordinates format');
    }
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
      this.loading.set(true);
      this.spinner.show();
      const res: any = await firstValueFrom(
        type == 'edit'
          ? this.addaService.editAdda(payload)
          : this.addaService.addAdda(payload),
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
      title: 'Add Adda',
      mode: 'form',
      fields: addFields(this.initialData().regionList || []),
      onSave: async (formData: any) => {
        await this.saveForm(formData, null, 'add');
      },
    });
  }
}
