import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  ActionButtonComponent,
  ActionButtonData,
  IconConfig,
} from '../../../shared/components/action-button/action-button.component';
import { CartMappingStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-cart-mapping',
  standalone: true,
  imports: [AdvancedGridComponent, ActionButtonComponent, SharedModule],
  templateUrl: './cart-mapping.component.html',
  styleUrl: './cart-mapping.component.scss',
})
export class CartMappingComponent implements OnInit {
  store: CartMappingStore = new CartMappingStore();

  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
