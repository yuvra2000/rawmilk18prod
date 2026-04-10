import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  ActionButtonComponent,
  ActionButtonData,
  IconConfig,
} from '../../../shared/components/action-button/action-button.component';
import { FranchiseMappingStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-franchise-mapping',
  standalone: true,
  imports: [AdvancedGridComponent, ActionButtonComponent, SharedModule],
  templateUrl: './franchise-mapping.component.html',
  styleUrl: './franchise-mapping.component.scss',
})
export class FranchiseMappingComponent implements OnInit {
  store: FranchiseMappingStore = new FranchiseMappingStore();

  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
