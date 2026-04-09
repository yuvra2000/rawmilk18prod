import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CartReportExceptionStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-cart-exception-report',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './cart-exception-report.component.html',
  styleUrl: './cart-exception-report.component.scss',
})
export class CartExceptionReportComponent implements OnInit {
  store: CartReportExceptionStore = new CartReportExceptionStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
