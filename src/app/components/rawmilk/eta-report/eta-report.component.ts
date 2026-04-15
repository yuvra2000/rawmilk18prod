import { Component } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { EtaStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-eta-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './eta-report.component.html',
  styleUrl: './eta-report.component.scss',
})
export class EtaReportComponent {
  store: EtaStore = new EtaStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
