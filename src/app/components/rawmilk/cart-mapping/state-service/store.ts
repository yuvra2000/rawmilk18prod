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
  mapVehicleListToOptions,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { cartMappingColumns, assignCartFields } from './config';
import { AlertService } from '../../../../shared/services/alert.service';
import { ActionButtonData } from '../../../../shared/components/action-button/action-button.component';
import { CartMappingService } from '../cart-mapping.service';
interface InitialData {
  cartList: any[];
  franchiseList?: any[];
  cartMappingList?: any[];
}
export class CartMappingStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private modal = inject(UniversalModalService);
  private cartMapppingService = inject(CartMappingService);
  private alertService = inject(AlertService);
  rowData = computed(() => this.initialData().cartMappingList || []);
  selectedRows = signal<any[]>([]);
  initialData = signal<InitialData>({
    cartList: [],
    franchiseList: [],
    cartMappingList: [],
  });
  loading = signal(false);
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: cartMappingColumns,
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
      this.spinner.show();
      this.loading.set(true);
      const params = createMasterParams();
      const cartParams = createFormData(token, {});
      const res: any = await firstValueFrom(
        this.cartMapppingService.initialData(params, cartParams),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res?.franchiseList, this.toast);
      handleApiResponse(res?.cartMappingList, this.toast);
      this.initialData.set({
        cartList: mapVehicleListToOptions(res.cartList?.VehicleList),
        franchiseList:
          res.franchiseList?.Data?.map((f: any) => ({ ...f, id: f.code })) ||
          [],
        cartMappingList: res.cartMappingList?.Data || [],
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
      case 'assign-cart':
        this.assignCart();
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
  assignCart() {
    this.modal.openForm({
      title: 'Assign Cart',
      fields: assignCartFields(
        this.initialData().franchiseList || [],
        this.initialData().cartList || [],
      ),
      mode: 'form',
      onSave: async (formData: any) => {
        await this.saveAssignCart(formData);
      },
    });
  }
  async saveAssignCart(formData: any) {
    const params = addParams(formData);
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.cartMapppingService.franchiseCartAssignment(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      handleApiResponse(res, this.toast);
      this.toast.success('Cart assigned successfully');
      this.loadInitialData();
    } catch (error) {
      this.toast.error('Failed to assign cart');
    } finally {
      this.spinner.hide();
    }
  }
  assignDe(data: any, type: number) {
    const title = type == 1 ? 'Assign Cart' : 'De-Assign Cart';
    const text =
      type == 1
        ? 'Are you sure you want to assign selected carts?'
        : 'Are you sure you want to de-assign selected carts?';
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
    this.loading.set(true);
    try {
      const res: any = await firstValueFrom(
        this.cartMapppingService.assignDeAssign(params),
      );
      handleSessionExpiry(res, this.toast);
      handleApiResponse(res, this.toast);
      this.toast.success(
        `Cart ${type == 1 ? 'assigned' : 'de-assigned'} successfully`,
      );
      this.loadInitialData();
    } catch (error: any) {
      this.toast.error(
        error?.error?.message ||
          `Failed to ${type == 1 ? 'assign' : 'de-assign'} cart`,
      );
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
}
