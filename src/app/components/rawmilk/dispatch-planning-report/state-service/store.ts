import { computed, inject, signal } from '@angular/core';
import {
  actionColumn,
  dispatchPlanningColumns,
  divertFields,
  filterfields,
} from './config';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { DispatchPlanningService } from '../dispatch-planning-report.service';
import {
  createFormData,
  handleApiResponse,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { createReportParams } from './utils';
import { Router } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
export interface InitialData {
  date?: any;
  mccList?: any[];
  milkList?: any[];
  supplierList?: any[];
  plantList?: any[];
  plantListDivert?: any[];
  dispatchReportData: any[];
}
interface res {
  masterOptions: any;
  reportData: any;
}
export class DispatchStore {
  date = signal<string>(new Date().toISOString().split('T')[0]);
  private dispatchPlanningService = inject(DispatchPlanningService);
  private toast = inject(ToastrService);
  private alert = inject(AlertService);
  private router = inject(Router);
  private modalService = inject(UniversalModalService);
  private spinner = inject(NgxSpinnerService);
  token = localStorage.getItem('AccessToken') || '';
  GroupId = localStorage.getItem('GroupId') || '';
  supplier_id = localStorage.getItem('supplier_id') || '';
  user_type = localStorage.getItem('AccountType') || '';
  initialData = signal<InitialData>({
    date: '',
    milkList: [],
    supplierList: [],
    plantList: [],
    plantListDivert: [],
    dispatchReportData: [],
  });
  constructor() {
    this.initialData.update((data) => ({
      ...data,
      date: new Date().toISOString().substring(0, 10),
    }));
    this.loadInitialData();
  }
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().milkList,
      this.initialData().supplierList,
      this.initialData().plantList,
    ),
  );
  divertFields = computed<any[]>(() =>
    divertFields(this.initialData().plantList),
  );

  dispatchConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: [...dispatchPlanningColumns, ...actionColumn],
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    autoSizeColumns: true,
  }));

  async loadInitialData() {
    this.spinner.show();
    try {
      const masterFilterParams = createFormData(this.token, {
        GroupId: this.GroupId,
        ForApp: '0',
        supplier_id: this.supplier_id,
      });

      // Format current date with time bounds
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const reportParams = createReportParams(todayDate);
      const res: res = await firstValueFrom(
        this.dispatchPlanningService.initializePageData(
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
        dispatchReportData: res.reportData?.Data,
        milkList: res.masterOptions?.Milk,
        supplierList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 6,
        ),
        plantList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 3,
        ),
        plantListDivert: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 3,
        ).map((item: any) => ({
          ...item,
          displayName: `${item.displayName} - Destination`,
        })),
      });
    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.spinner.hide();
    }
  }
  async onFormSubmit(filterValues: any) {
    console.log('Form submitted with values:', filterValues);
    this.spinner.show();
    try {
      // Format date range and create report params with filter values
      const reportParams = createReportParams(filterValues?.date, filterValues);

      // Call the production planning API
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.getProductionPlanningData(reportParams),
      );

      // Update dispatch report data with filtered results
      this.initialData.update((data) => ({
        ...data,
        dispatchReportData: res?.Data || [],
      }));

      console.log('Production planning data fetched:', res);
    } catch (error) {
      console.error('Error fetching production planning data:', error);
    } finally {
      this.spinner.hide();
    }
  }
  openCreateDispatch() {
    this.router.navigate(['/dispatch-planning']);
  }
  onDivert(row: any) {
    this.modalService.openForm({
      title: 'Divert Dispatch Plan',
      fields: divertFields(this.initialData().plantListDivert),
      mode: 'form',
      initialData: {
        date: new Date().toISOString().substring(0, 10),
      },
      onSave: async (formValues: any) => {
        var formData = createFormData(this.token, {
          id: row?._id || '',
          remark: formValues?.remark || '',
          destination: formValues?.destination || '',
          destination_old: row?.destination || '',
          divert_date: formValues?.date || '',
          ForApp: '0',
        });
        try {
          const res: any = await firstValueFrom(
            this.dispatchPlanningService.divertDispatch(formData),
          );
          this.fetchReportData(
            this.filterfields().find((f) => f.name === 'date')?.value,
          );
          handleApiResponse(
            res,
            this.alert,
            undefined,
            res?.Message || 'Error diverting dispatch plan',
            'Dispatch diverted successfully',
          );
        } catch (error) {
          this.alert.showError('Error', 'Failed to divert dispatch plan.');
        }
      },
    });
  }
  fetchReportData = async (date: any) => {
    try {
      const reportParams = createReportParams(date);
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.getProductionPlanningData(reportParams),
      );
      if (handleSessionExpiry(res, this.toast)) {
        return;
      }
      this.initialData.update((data) => ({
        ...data,
        dispatchReportData: res?.Data || [],
      }));
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };
  onDelete(row: any) {
    this.alert
      .confirmDelete(
        'Confirm Delete',
        'Are you sure you want to delete this dispatch plan? This action cannot be undone.',
        'Yes, delete it!',
        'Cancel',
      )
      .then(async (confirmed) => {
        if (confirmed) {
          var formData = createFormData(this.token, {
            id: row?._id || '',
            remark: '', // append remark entered by user
            ForApp: '0',
          });
          try {
            const res: any = await firstValueFrom(
              this.dispatchPlanningService.deleteDispatch(formData),
            );
            if (res.Status == 'success') {
              this.alert.showSuccess('Deleted!', res.Data);
            } else {
              this.alert.showError('Error', res.Data);
            }
          } catch (error) {
            this.alert.showError('Error', 'Failed to delete indent.');
          }
        } else {
        }
      });
  }
}
