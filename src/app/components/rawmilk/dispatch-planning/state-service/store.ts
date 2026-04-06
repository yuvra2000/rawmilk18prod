import { computed, signal } from '@angular/core';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { filterfields } from './config';
export interface InitialData {
  milkList?: any[];
  tankerList?: any[];
  destinationList?: any[];
}
export class DispatchPlanningStore {
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
  onFormSubmit(data: any) {}
}
