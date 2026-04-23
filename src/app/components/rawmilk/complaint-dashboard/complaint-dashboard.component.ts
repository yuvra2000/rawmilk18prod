import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { ComplaintDashboardReportState } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-complaint-dashboard',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './complaint-dashboard.component.html',
  styleUrl: './complaint-dashboard.component.scss',
})
export class ComplaintDashboardComponent implements OnInit {
  store: ComplaintDashboardReportState = new ComplaintDashboardReportState();
  ngOnInit(): void {}
}
