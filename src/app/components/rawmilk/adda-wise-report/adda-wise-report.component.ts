import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { AddaWiseReportState } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-adda-wise-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './adda-wise-report.component.html',
  styleUrl: './adda-wise-report.component.scss',
})
export class AddaWiseReportComponent {
  store: AddaWiseReportState = new AddaWiseReportState();
  ngOnInit(): void {}
}
