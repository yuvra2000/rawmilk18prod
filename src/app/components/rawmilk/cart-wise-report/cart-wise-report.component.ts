import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';

import { SharedModule } from '../../../shared/shared.module';
import { CartWiseReportState } from './state-service/store';
@Component({
  selector: 'app-cart-wise-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './cart-wise-report.component.html',
  styleUrl: './cart-wise-report.component.scss',
})
export class CartWiseReportComponent {
  store: CartWiseReportState = new CartWiseReportState();
}
