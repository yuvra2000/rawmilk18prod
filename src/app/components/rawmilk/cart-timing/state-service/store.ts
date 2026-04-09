import { computed, inject, signal } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import {
  addParams,
  buildPayload,
  createMasterParams,
  editParams,
} from './utils';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import {
  addFields,
  cartTimingColumns,
  editFields,
  getDayOption,
  getStatusOption,
} from './config';
import { AlertService } from '../../../../shared/services/alert.service';
import { CartTimingService } from '../cart-timing.service';
interface InitialData {
  addaList: any[];
  franchiseList?: any[];
  cartTimingData?: any[];
}
export class AddaStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modal = inject(UniversalModalService);
  private cartTimingService = inject(CartTimingService);
  private alertService = inject(AlertService);
  private gridComponent: AdvancedGridComponent | null = null;
  loading = signal(false);
  setGridComponent(gridComponent: AdvancedGridComponent): void {
    this.gridComponent = gridComponent;
  }
  rowData = computed(() => this.initialData()?.cartTimingData || []);
  initialData = signal<InitialData>({
    addaList: [],
    franchiseList: [],
    cartTimingData: [],
  });
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: cartTimingColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    // isFitGridWidth: true,
  }));
  async loadInitialData() {
    try {
      this.gridComponent?.showLoadingOverlay();
      this.spinner.show();
      this.loading.set(true);
      const params = createMasterParams();
      const res: any = await firstValueFrom(
        this.cartTimingService.initialData(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res?.addaList, this.toast);
      handleApiResponse(res?.franchiseList, this.toast);
      handleApiResponse(res?.cartTimingData, this.toast);
      this.initialData.set({
        addaList:
          res.addaList?.Data?.map((a: any) => ({ ...a, id: a?.code })) || [],
        franchiseList:
          res.franchiseList?.Data?.map((a: any) => ({ ...a, id: a?.code })) ||
          [],
        cartTimingData: res.cartTimingData?.Data || [],
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
      this.gridComponent?.hideLoadingOverlay();
      this.spinner.hide();
    }
  }
  onEdit(data: any) {
    const selectedAdda =
      (this.initialData().addaList || []).find(
        (item: any) =>
          item?.id === data?.adda_code ||
          item?.adda_code === data?.adda_code ||
          item?.code === data?.adda_code,
      ) || null;
    const selectedFranchise =
      (this.initialData().franchiseList || []).find(
        (item: any) =>
          item?.id === data?.franchise_code ||
          item?.franchise_code === data?.franchise_code ||
          item?.code === data?.franchise_code,
      ) || null;
    this.modal.openForm({
      title: 'Edit Cart Timing',
      mode: 'form',
      fields: editFields(
        this.initialData().addaList || [],
        this.initialData().franchiseList || [],
      ),
      initialData: {
        ...data,
        adda_code: selectedAdda,
        franchise_code: selectedFranchise,
        day: getDayOption(data?.day),
        status: getStatusOption(data?.status),
      },
      onSave: async (formData: any) => {
        await this.saveForm(formData, data, 'edit');
      },
    });
  }

  async saveForm(formData: any, data: any, type: 'edit' | 'add') {
    if (type === 'add') {
      const transformedPayload = buildPayload(formData);
      if (transformedPayload.length === 0) {
        throw new Error('Please fill at least one franchise timing row');
      }
      console.log('Transformed cart timing payload', transformedPayload);
    }

    if (type == 'edit') {
      const isConfirmed = await this.alertService.confirmEdit(
        'Do you want to edit this Cart Timing?',
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
      this.gridComponent?.showLoadingOverlay();
      this.spinner.show();
      this.loading.set(true);
      const res: any = await firstValueFrom(
        type == 'edit'
          ? this.cartTimingService.editAddaCartTiming(payload)
          : this.cartTimingService.addAddaCartTimingBeta(payload),
      );

      const isSuccess = handleApiResponse(res, this.toast);
      if (!isSuccess) {
        this.toast.error('Failed to update Cart Timing');
      }
      await this.loadInitialData();
    } catch (error: any) {
      if (error?.error?.message) {
        this.toast.error(error.error.message || 'Something went wrong');
      }
    } finally {
      this.loading.set(false);
      this.gridComponent?.hideLoadingOverlay();
      this.spinner.hide();
    }
  }
  assignCartTiming() {
    const dynamicFields = signal(
      addFields(
        this.initialData().addaList || [],
        this.initialData().franchiseList || [],
        1,
      ),
    );

    this.modal.openForm({
      title: 'Add Cart Timing',
      mode: 'form',
      size: 'lg',
      fields: dynamicFields,
      onFieldChange: async (event: any, allFormData) => {
        if (event?.controlName === 'noOfFranchise') {
          const count = Math.max(1, Number(event?.value || 1));
          dynamicFields.set(
            addFields(
              this.initialData().addaList || [],
              this.initialData().franchiseList || [],
              count,
            ),
          );
        }
      },
      onSave: async (formData: any) => {
        console.log('form data', formData);
        await this.saveForm(formData, null, 'add');
      },
    });
  }
}
