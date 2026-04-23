import { Component } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { OtherStoppageReportStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-other-stoppage-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './other-stoppage-report.component.html',
  styleUrl: './other-stoppage-report.component.scss',
})
export class OtherStoppageReportComponent {
  store: OtherStoppageReportStore = new OtherStoppageReportStore();
  ngOnInit(): void {}
}
