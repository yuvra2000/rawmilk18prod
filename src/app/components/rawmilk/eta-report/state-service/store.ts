import { computed, inject, signal } from '@angular/core';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { bucketDetailsColumns, etaReportColumns, filterfields } from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  supplier_id,
  token,
  userType,
} from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { EtaReportService } from '../eta-report.service';
import { createReportParams } from './utils';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
export class InitialData {
  etaReportData!: any[];
  milkList?: any[];
  supplierList?: any[];
  plantList?: any[];
  from?: string;
  to?: string;
}
export class EtaStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private etaService = inject(EtaReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  initialData = signal<InitialData>({
    milkList: [],
    supplierList: [],
    plantList: [],
    etaReportData: [],
    from: new Date().toISOString().substring(0, 10),
    to: new Date().toISOString().substring(0, 10),
  });
  etaConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: etaReportColumns(this.initialData().etaReportData || []),
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    autoSizeColumns: true,
  }));
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().milkList,
      this.initialData().supplierList,
      this.initialData().plantList,
    ),
  );
  async loadInitialData() {
    this.spinner.show();
    try {
      const masterFilterParams = createFormData(token, {
        GroupId: GroupId,
        ForApp: '0',
        supplier_id: supplier_id,
      });

      // Format current date with time bounds
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const reportParams = createReportParams(todayDate);
      const res: any = await firstValueFrom(
        this.etaService.initializePageData(masterFilterParams, reportParams),
      );
      if (
        handleSessionExpiry(res?.reportData, this.toast) ||
        handleSessionExpiry(res?.masterOptions, this.toast)
      ) {
        return;
      }
      this.initialData.set({
        etaReportData: res.reportData?.Data,
        milkList: res.masterOptions?.Milk,
        supplierList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 6,
        ),
        plantList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 3,
        ),
        from: this.initialData().from,
        to: this.initialData().to,
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.spinner.hide();
    }
  }
  onFormSubmit(data: any) {
    const selectedFrom =
      data?.from ||
      this.initialData().from ||
      new Date().toISOString().substring(0, 10);
    const selectedTo = data?.to || this.initialData().to || selectedFrom;

    this.initialData.update((prev) => ({
      ...prev,
      from: selectedFrom,
      to: selectedTo,
    }));

    const params = createReportParams(selectedFrom, selectedTo, data);

    this.loadReportData(params);
  }

  async onClick(data: any) {
    console.log('Clicked data:', data);
    let formData = createFormData(token, {
      GroupId: GroupId,
      ForApp: '0',
      supplier: '',
      dateFrom: this.initialData().from,
      dateTo: this.initialData().to,
      plant: data?.row?.Plant || '',
      milkType: data?.row?.MilkType || '',
      user_type: userType,
    });
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.etaService.getBucketDetails(formData),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      if (res.Data?.[data?.label]?.length === 0) {
        this.toast.info('No data found for the selected criteria.');
        return;
      }
      handleApiResponse(res, this.toast);
      this.modal.openGridModal({
        title: 'Bucket Details',
        columns: bucketDetailsColumns,
        rowData: res.Data?.[data?.label] || [],
        size: 'xl',
      });
    } catch (error: any) {
      this.toast.error(
        error?.error?.message || 'Error loading bucket details:',
      );
      console.error('Error loading bucket details:', error);
    } finally {
      this.spinner.hide();
    }
  }
  private async loadReportData(params: FormData) {
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(this.etaService.getETAData(params));
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      if (res?.Data?.length === 0) {
        this.toast.info('No data found for the selected criteria.');
      }
      this.initialData.update((prev) => ({
        ...prev,
        etaReportData: res.Data || [],
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.spinner.hide();
    }
  }
}
