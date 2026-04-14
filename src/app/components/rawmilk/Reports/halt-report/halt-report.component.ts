import { Component, signal } from '@angular/core';
import { FilterFormComponent } from '../../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

import { NgbCollapseModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/shared.module';
import { HaltReportStore } from './state-service/store';
@Component({
  selector: 'app-halt-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
    NgbCollapseModule,
    NgbTooltip,
  ],
  templateUrl: './halt-report.component.html',
  styleUrl: './halt-report.component.scss',
})
export class HaltReportComponent {
  store: HaltReportStore = new HaltReportStore();
  isChartCollapsed = signal<boolean>(false);
  onChartIconClick(): void {
    this.isChartCollapsed.set(!this.isChartCollapsed());
  }
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
