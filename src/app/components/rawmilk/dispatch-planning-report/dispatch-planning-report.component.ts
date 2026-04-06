import { Component, OnInit } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { DispatchStore } from './state-service/store';

@Component({
  selector: 'app-dispatch-planning',
  standalone: true,
  imports: [
    CollapseWrapperComponent,
    AdvancedGridComponent,
    FilterFormComponent,
  ],
  templateUrl: './dispatch-planning-report.component.html',
  styleUrl: './dispatch-planning-report.component.scss',
})
export class DispatchPlanningReportComponent implements OnInit {
  store: DispatchStore = new DispatchStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
