import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FranchiseStore } from './state-service/store';

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [AdvancedGridComponent],
  templateUrl: './franchise.component.html',
  styleUrl: './franchise.component.scss',
})
export class FranchiseComponent implements OnInit {
  store: FranchiseStore = new FranchiseStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
