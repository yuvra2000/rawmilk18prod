import { computed, inject, OnInit, signal } from '@angular/core';
import { ProjectionService } from '../projection.service';
import { firstValueFrom } from 'rxjs';
import {
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { filterfields } from './config';
import { createFormData } from '../../../../shared/utils/shared-utility.utils';
import { TabConfig } from '../../../../shared/components/nav-tab/nav-tab.component';
import { GridProjectionComponent } from '../grid-projection/grid-projection.component';

export class ProjectionStore {
  projectionRowData = signal<any[]>([]);
  token = localStorage.getItem('AccessToken') || '';
  GroupId = localStorage.getItem('GroupId') || '';
  supplier_id = localStorage.getItem('supplier_id') || '';
  usertype = localStorage.getItem('usertype') || '';
  initialData = signal<any>({
    mccList: [],
    milkList: [],
    plantSupplierList: [],
  });
  tabsComp = computed<TabConfig[]>(() => {
    return this.tabs();
  });
  tabs = signal<TabConfig[]>([
    {
      title: 'Week 1',
      component: GridProjectionComponent,
      componentInputs: { projectionData: this.projectionRowData, week: 1 },
    },
    {
      title: 'Week 2',
      component: GridProjectionComponent,
      componentInputs: { projectionData: this.projectionRowData, week: 2 },
    },
    {
      title: 'Week 3',
      component: GridProjectionComponent,
      componentInputs: { projectionData: this.projectionRowData, week: 3 },
    },
    {
      title: 'Week 4',
      component: GridProjectionComponent,
      componentInputs: { projectionData: this.projectionRowData, week: 4 },
    },
  ]);
  private projectionService = inject(ProjectionService);
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
      console.log('Response from service:', res);
      this.projectionRowData.set(res?.inventoryData?.Data || []);
      this.initialData.set({
        mccList: res?.mccOptions?.Data || [],
        milkList: res?.masterOptions?.Milk || [],
        plantSupplierList: res?.masterOptions?.PlantSupplier || [],
      });
      console.log('Initial data loaded:', this.initialData());
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
}
