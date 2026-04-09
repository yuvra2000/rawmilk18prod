import { Component } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CartDashboardStore } from './state-service/store';
@Component({
  selector: 'app-cart-dashboard',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './cart-dashboard.component.html',
  styleUrl: './cart-dashboard.component.scss',
})
export class CartDashboardComponent {
  store: CartDashboardStore = new CartDashboardStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
