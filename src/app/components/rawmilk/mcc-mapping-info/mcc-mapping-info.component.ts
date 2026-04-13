import { Component, OnInit } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { MCCMappingInfoStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-mcc-mapping-info',
  standalone: true,
  imports: [
    CollapseWrapperComponent,
    AdvancedGridComponent,
    FilterFormComponent,
    SharedModule,
  ],
  templateUrl: './mcc-mapping-info.component.html',
  styleUrl: './mcc-mapping-info.component.scss',
})
export class MccMappingInfoComponent implements OnInit {
  store: MCCMappingInfoStore = new MCCMappingInfoStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
