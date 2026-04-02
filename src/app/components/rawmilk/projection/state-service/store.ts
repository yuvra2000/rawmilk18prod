import { computed, inject, signal } from '@angular/core';
import { ProjectionService } from '../projection.service';
import { firstValueFrom } from 'rxjs';
import { filterfields } from './config';
import {
  createFormData,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { TabConfig } from '../../../../shared/components/nav-tab/nav-tab.component';
import { GridProjectionComponent } from '../grid-projection/grid-projection.component';
import { AlertService } from '../../../../shared/services/alert.service';
export interface InitialData {
  mccList: any[];
  milkList: any[];
  plantSupplierList: any[];
  PrjAddStartDate: string;
  PrjAddEndDate: string;
  month?: string;
}
export class ProjectionStore {
  projectionRowData = signal<any[]>([]);
  token = localStorage.getItem('AccessToken') || '';
  GroupId = localStorage.getItem('GroupId') || '';
  supplier_id = localStorage.getItem('supplier_id') || '';
  usertype = localStorage.getItem('usertype') || '';
  initialData = signal<InitialData>({
    mccList: [],
    milkList: [],
    plantSupplierList: [],
    PrjAddStartDate: '',
    PrjAddEndDate: '',
    month: '',
  });
  tabsComp = computed<TabConfig[]>(() => {
    return this.tabs();
  });
  tabs = computed<TabConfig[]>(() => [
    {
      title: 'Week 1',
      component: GridProjectionComponent,
      componentInputs: {
        projectionData: this.projectionRowData,
        week: 1,
        currentMonthForm: this.initialData().month,
      },
    },
    {
      title: 'Week 2',
      component: GridProjectionComponent,
      componentInputs: {
        projectionData: this.projectionRowData,
        week: 2,
        currentMonthForm: this.initialData().month,
      },
    },
    {
      title: 'Week 3',
      component: GridProjectionComponent,
      componentInputs: {
        projectionData: this.projectionRowData,
        week: 3,
        currentMonthForm: this.initialData().month,
      },
    },
    {
      title: 'Week 4',
      component: GridProjectionComponent,
      componentInputs: {
        projectionData: this.projectionRowData,
        week: 4,
        currentMonthForm: this.initialData().month,
      },
    },
  ]);
  private projectionService = inject(ProjectionService);
  private toast = inject(AlertService);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().mccList,
      this.initialData().milkList,
      this.initialData().plantSupplierList,
    ),
  );
  currentDate = new Date();
  currentMonth: any;
  initialDataf: any;
  constructor() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
    this.currentMonth = `${year}-${month}`;
    this.initialDataf = {
      month: this.currentMonth,
    };
  }
  async loadInitialData() {
    const filterParams = {
      AccessToken: this.token,
      GroupId: this.GroupId,
      ForApp: '0',
      supplier_id: this.supplier_id,
    };
    const masterFilterParams = createFormData(this.token, {
      GroupId: this.GroupId,
      ForApp: '0',
      supplier_id: this.supplier_id,
    });
    const reportParams = createFormData(this.token, {
      MonthMM: '',
      MilkId: '',
      ForWeb: '1',
      SupplierId: '',
      MccId: '',
      Role: '',
      DispatchLoc: '',
    });
    try {
      const res: any = await firstValueFrom(
        this.projectionService.initializePageData(
          filterParams,
          masterFilterParams,
          reportParams,
        ),
      );
      handleSessionExpiry(res?.inventoryData, this.toast);
      this.projectionRowData.set(res?.inventoryData?.Data || []);
      this.initialData.set({
        mccList: res?.mccOptions?.Data || [],
        milkList: res?.masterOptions?.Milk || [],
        plantSupplierList: res?.masterOptions?.PlantSupplier || [],
        PrjAddStartDate: res?.inventoryData?.PrjAddStartDate || '',
        PrjAddEndDate: res?.inventoryData?.PrjAddEndDate || '',
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
  async onFormSubmit(filterValues: any) {
    const monthMM = filterValues?.month
      ? new Date(filterValues.month).getMonth() + 1
      : '';
    const filterFormData = createFormData(this.token, {
      MonthMM: monthMM.toString() || '',
      MilkId: filterValues.milkType?.id || '',
      MccId: filterValues.mcc?.mcc_id || '',
      SupplierId: filterValues.Supplier?.id || '',
      Role: filterValues.role?.id || '',
      ForWeb: '1',
      DispatchLoc: filterValues?.dispatchLoc?.id || '',
    });
    try {
      const res: any = await firstValueFrom(
        this.projectionService.getProjectionReport(filterFormData),
      );
      handleSessionExpiry(res, this.toast);
      this.projectionRowData.set(res?.Data || []);
      this.initialData.update((data) => ({
        ...data,
        PrjAddEndDate: res?.PrjAddEndDate || data.PrjAddEndDate,
        prjAddStartDate: res?.PrjAddStartDate || data.PrjAddStartDate,
        month: filterValues.month || data.month,
      }));
    } catch (error) {}
  }
  isEditable(startEditDateTime: string, endEditDateTime: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(startEditDateTime.replace(' ', 'T'));
    const endDate = new Date(endEditDateTime.replace(' ', 'T'));

    return currentDate >= startDate && currentDate <= endDate;
  }
}
