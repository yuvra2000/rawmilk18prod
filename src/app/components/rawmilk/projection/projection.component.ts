import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { ProjectionStore } from './state-service/store';
import { NavTabComponent } from '../../../shared/components/nav-tab/nav-tab.component';

@Component({
  selector: 'app-projection',
  standalone: true,
  imports: [
    FilterFormComponent,
    AdvancedGridComponent,
    CollapseWrapperComponent,
    NavTabComponent,
  ],
  templateUrl: './projection.component.html',
  styleUrl: './projection.component.scss',
})
export class ProjectionComponent implements OnInit {
  store: ProjectionStore = new ProjectionStore();
  initialData$ = this.store.initialDataf;
  constructor() {}

  ngOnInit(): void {
    this.store.loadInitialData();
  }
  onFormSubmit(filterValues: any) {
    console.log('Form submitted with values:', filterValues);
    // Here you can call a method in your store to fetch data based on the filter values
    // For example: this.store.fetchProjectionData(filterValues);
  }
  onFilterChange(changedValues: any) {
    console.log('Filter values changed:', changedValues);
    // Here you can call a method in your store to fetch data based on the changed filter values
    // For example: this.store.fetchProjectionData(changedValues);
  }
  openAddProjection() {
    // Logic to open the add projection form or modal
    console.log('Opening add projection form...');
  }
}
