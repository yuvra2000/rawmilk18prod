import { Component } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { SummarizedReportStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-summarized-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './summarized-report.component.html',
  styleUrl: './summarized-report.component.scss',
})
export class SummarizedReportComponent {
  store: SummarizedReportStore = new SummarizedReportStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
