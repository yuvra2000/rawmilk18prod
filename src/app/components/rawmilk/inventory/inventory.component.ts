import { Component, OnInit, signal } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { inventoryFilterFields } from './state-service/config';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  filterfields = signal<FieldConfig[]>(inventoryFilterFields);

  inventoryRowData = signal<any[]>([]);
  inventoryConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [],
  });
  ngOnInit(): void {}
  openAddInventory() {
    // Logic to open the Add Indent form
  }
  onFormSubmit(formData: any) {}
}
