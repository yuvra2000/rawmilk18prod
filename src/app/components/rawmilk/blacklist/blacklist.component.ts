import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { BlackListStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [
    FilterFormComponent,
    CollapseWrapperComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './blacklist.component.html',
  styleUrl: './blacklist.component.scss',
})
export class BlacklistComponent implements OnInit {
  store: BlackListStore = new BlackListStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
