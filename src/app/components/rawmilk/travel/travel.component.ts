import { Component, signal, inject, input, computed } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { travelfeilds } from './state-service/config';

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectComponent,
    CollapseWrapperComponent,
    FilterFormComponent,
    NgbModule,
    AdvancedGridComponent,
  ],
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss',
})
export class TravelComponent {
  filterfields = signal<FieldConfig[]>(travelfeilds);

  onFormSubmit(event: any) {}
}
