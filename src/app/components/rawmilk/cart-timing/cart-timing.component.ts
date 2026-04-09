import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { AddaStore } from './state-service/store';

@Component({
  selector: 'app-cart-timing',
  standalone: true,
  imports: [AdvancedGridComponent],
  templateUrl: './cart-timing.component.html',
  styleUrl: './cart-timing.component.scss',
})
export class CartTimingComponent implements OnInit, AfterViewInit {
  @ViewChild(AdvancedGridComponent)
  public gridComponent!: AdvancedGridComponent;
  store: AddaStore = new AddaStore();

  ngOnInit(): void {
    this.store.loadInitialData();
  }

  ngAfterViewInit(): void {
    this.store.setGridComponent(this.gridComponent);
  }
}
