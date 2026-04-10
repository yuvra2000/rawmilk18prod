import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FranchiseStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-franchise',
  standalone: true,
  imports: [AdvancedGridComponent, SharedModule],
  templateUrl: './franchise.component.html',
  styleUrl: './franchise.component.scss',
})
export class FranchiseComponent implements OnInit {
  store: FranchiseStore = new FranchiseStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
