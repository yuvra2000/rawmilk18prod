import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CartReportExceptionStore } from './state-service/store';
@Component({
  selector: 'app-agreement-info',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './agreement-info.component.html',
  styleUrl: './agreement-info.component.scss',
})
export class AgreementInfoComponent {
  store: CartReportExceptionStore = new CartReportExceptionStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
