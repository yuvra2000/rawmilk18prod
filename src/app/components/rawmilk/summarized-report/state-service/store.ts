import { computed, inject, signal } from '@angular/core';
import {
  GridConfig,
  GridColumnConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { buildReportColumns, filterfields } from './config';
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
import { createReportParams } from './utils';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { SummarizedReportService } from '../summarized-report.service';
export class InitialData {
  summarizedReportData!: any;
  milkList?: any[];
  supplierList?: any[];
  plantList?: any[];
  from?: string;
  to?: string;
}
export class SummarizedReportStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private summarizedReportService = inject(SummarizedReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  initialData = signal<InitialData>({
    milkList: [],
    supplierList: [],
    plantList: [],
    summarizedReportData: { columns: [], data: [] },
    from: new Date().toISOString().substring(0, 10),
    to: new Date().toISOString().substring(0, 10),
  });
  summarizedRows = computed<any[]>(() => {
    const report = this.initialData().summarizedReportData;
    if (Array.isArray(report)) return report;
    return report?.data || report?.Data || [];
  });

  reportColumns = computed<GridColumnConfig[]>(() =>
    buildReportColumns(this.initialData().summarizedReportData),
  );

  summarizedConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: this.reportColumns(),
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
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
        this.summarizedReportService.initializePageData(
          masterFilterParams,
          reportParams,
        ),
      );
      if (
        handleSessionExpiry(res?.reportData, this.toast) ||
        handleSessionExpiry(res?.masterOptions, this.toast)
      ) {
        return;
      }
      this.initialData.set({
        summarizedReportData: res.reportData,
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

    this.lastFilterValues.set(data);

    const params = createReportParams(selectedFrom, selectedTo, data);

    this.loadReportData(params);
  }

  async fetchDetailedReport(cellParams: any) {
    const filterData = this.lastFilterValues();
    const cellData = cellParams?.data || {};

    const colName = cellParams?.colDef?.field || '';
    let detailSupplier = '';
    let detailPlant = '';

    if (colName === 'Supplier' && cellData.Supplier) {
      detailSupplier = cellData.Supplier.split('-')[0]?.trim() || '';
    } else if (colName === 'Plant' && cellData.Plant) {
      detailPlant = cellData.Plant.split('-')[0]?.trim() || '';
    }

    const milkCodes = Array.isArray(filterData?.milkType)
      ? filterData.milkType.map((m: any) => m?.id || m?.code || '')
      : [];
    const supplierCodes = Array.isArray(filterData?.supplier)
      ? filterData.supplier.map((s: any) => s?.id || s?.code || '')
      : [];
    const plantCodes = Array.isArray(filterData?.plant)
      ? filterData.plant.map((p: any) => p?.id || p?.code || '')
      : [];

    const formData = createFormData(token, {
      GroupId: GroupId,
      ForApp: '0',
      dateFrom: this.initialData().from,
      dateTo: this.initialData().to,
      supplier: detailSupplier || supplierCodes.join(',') || '',
      plant: detailPlant || plantCodes.join(',') || '',
      milkType: milkCodes.join(',') || '',
      user_type: userType,
    });

    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.summarizedReportService.getSummarizedReportDetails(formData),
      );

      if (handleSessionExpiry(res, this.toast)) {
        return;
      }

      const detailedRows = res?.data || res?.Data || [];
      if (detailedRows.length === 0) {
        this.toast.info('No detailed data found for the selected criteria.');
        return;
      }

      handleApiResponse(res, this.toast);

      this.modal.openGridModal({
        title: `Detailed Report - ${colName}`,
        columns: buildReportColumns(res),
        rowData: detailedRows,
      });
    } catch (error: any) {
      this.toast.error(
        error?.error?.message || 'Error loading detailed report:',
      );
    } finally {
      this.spinner.hide();
    }
  }

  private async loadReportData(params: FormData) {
    this.spinner.show();
    try {
      const res: any = await firstValueFrom(
        this.summarizedReportService.getSummarizedReport(params),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      const rows = res?.data || res?.Data || [];
      if (rows.length === 0) {
        this.toast.info('No data found for the selected criteria.');
      }
      this.initialData.update((prev) => ({
        ...prev,
        summarizedReportData: res || { columns: [], data: [] },
      }));
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading report data:');
    } finally {
      this.spinner.hide();
    }
  }
}
