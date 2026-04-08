import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FranchiseMappingStore } from './state-service/store';

@Component({
  selector: 'app-adda',
  standalone: true,
  imports: [AdvancedGridComponent],
  templateUrl: './franchise-mapping.component.html',
  styleUrl: './franchise-mapping.component.scss',
})
export class FranchiseMappingComponent implements OnInit {
  store: FranchiseMappingStore = new FranchiseMappingStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
