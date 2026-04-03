import { computed, inject, signal } from '@angular/core';
import { dispatchPlanningColumns, filterfields } from './config';
import { GridConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { DispatchPlanningService } from '../dispatch-planning.service';
import { createFormData } from '../../../../shared/utils/shared-utility.utils';
export interface InitialData {
  mccList?: any[];
  milkList?: any[];
  supplierList?: any[];
  plantList?: any[];
  dispatchReportData: any[];
}
export class DispatchStore {
  private dispatchPlanningService = inject(DispatchPlanningService);
  token = localStorage.getItem('AccessToken') || '';
  GroupId = localStorage.getItem('GroupId') || '';
  supplier_id = localStorage.getItem('supplier_id') || '';
  user_type = localStorage.getItem('AccountType') || '';
  initialData = signal<InitialData>({
    milkList: [],
    supplierList: [],
    plantList: [],
    dispatchReportData: [],
  });
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().milkList,
      this.initialData().supplierList,
      this.initialData().plantList,
    ),
  );
  dispatchConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: dispatchPlanningColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    height: '200px',
    context: {
      componentParent: this,
    },
  }));
  async loadInitialData() {
    try {
      const masterFilterParams = createFormData(this.token, {
        GroupId: this.GroupId,
        ForApp: '0',
        supplier_id: this.supplier_id,
      });

      // Format current date with time bounds
      const today = new Date();
      const todayDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const dateFrom = `${todayDate} 00:00:00`; // 2026-04-03 00:00:00
      const dateTo = `${todayDate} 23:59:59`; // 2026-04-03 23:59:59

      const reportParams = createFormData(this.token, {
        dateFrom: dateFrom,
        dateTo: dateTo,
        milkType: '',
        ForApp: '0',
        supplier: '',
        plant: '',
        user_type: this.user_type,
        GroupId: this.GroupId,
      });
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.initializePageData(
          masterFilterParams,
          reportParams,
        ),
      );

      this.initialData.set({
        dispatchReportData: res.reportParams?.Data,
        milkList: res.masterOptions?.Milk,
        supplierList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 6,
        ),
        plantList: res.masterOptions?.PlantSupplier?.filter(
          (item: any) => item.type == 3,
        ),
      });
      console.log('Initial data loaded:', this.initialData());
    } catch (error) {}
  }
  async onFormSubmit(filterValues: any) {
    console.log('Form submitted with values:', filterValues);
    try {
      // Format date range
      const todayDate = filterValues?.date;
      const dateFrom = `${todayDate} 00:00:00`;
      const dateTo = `${todayDate} 23:59:59`;

      // Create report params with filter values
      const reportParams = createFormData(this.token, {
        dateFrom: dateFrom,
        dateTo: dateTo,
        milkType: filterValues.milkType?.id || '',
        ForApp: '0',
        supplier: filterValues.supplier?.id || '',
        plant: filterValues.plant?.id || '',
        user_type: this.user_type,
        GroupId: this.GroupId,
      });

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
    }
  }
  onFilterChange(changedValues: any) {}
  openCreateDispatch() {
    // Logic to open a modal or navigate to a page for creating a new dispatch
    console.log('Open create dispatch form');
  }
}
