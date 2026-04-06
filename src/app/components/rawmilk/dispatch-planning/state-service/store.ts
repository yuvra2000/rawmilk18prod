import { computed, inject, signal } from '@angular/core';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { filterfields, masterFilterParams, tankerFilterParams } from './config';
import { firstValueFrom } from 'rxjs';
import { DispatchPlanningService } from '../dispatch-planning.service';
import { AlertService } from '../../../../shared/services/alert.service';
import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';
export interface InitialData {
  milkList?: any[];
  tankerList?: any[];
  destinationList?: any[];
}
export class DispatchPlanningStore {
  private dispatchPlanningService = inject(DispatchPlanningService);
  private alertService = inject(AlertService);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().milkList,
      this.initialData().tankerList,
      this.initialData().destinationList,
    ),
  );
  initialData = signal<InitialData>({
    milkList: [],
    tankerList: [],
    destinationList: [],
  });
  constructor() {
    console.log('DispatchPlanningStore initialized', filterfields());
  }
  async loadInitialData() {
    try {
      
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.initializePageData(masterFilterParams, tankerFilterParams),
      );
      this.initialData.set({
        milkList: res.masterOptions.milkList || [],
        tankerList: res.tankerFilter.tankerList || [],
        destinationList: res.masterOptions.plantList || [],
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.alertService.error('Error loading initial data');
    }
  }
  onFormSubmit(data: any) {}
}
