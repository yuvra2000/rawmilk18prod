import { Component, signal } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CartDashboardStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
import { ReusableStatCardComponent } from '../../../shared/components/reusable-stat-card/reusable-stat-card.component';
import { ReusableChartComponent } from '../../../shared/components/reusable-chart/reusable-chart.component';
import { NgbCollapseModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-cart-dashboard',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    ReusableStatCardComponent,
    ReusableChartComponent,
    SharedModule,
    NgbCollapseModule,
    NgbTooltip,
  ],
  templateUrl: './cart-dashboard.component.html',
  styleUrl: './cart-dashboard.component.scss',
})
export class CartDashboardComponent {
  store: CartDashboardStore = new CartDashboardStore();
  isChartCollapsed = signal<boolean>(false);
  onChartIconClick(): void {
    this.isChartCollapsed.set(!this.isChartCollapsed());
  }
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
