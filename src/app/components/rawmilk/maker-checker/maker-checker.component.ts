import { Component, OnInit } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { MakerCheckerStore } from './state-service/store';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-maker-checker',
  standalone: true,
  imports: [
    CollapseWrapperComponent,
    AdvancedGridComponent,
    FilterFormComponent,
    SharedModule,
  ],
  templateUrl: './maker-checker.component.html',
  styleUrl: './maker-checker.component.scss',
})
export class MakerCheckerComponent implements OnInit {
  store: MakerCheckerStore = new MakerCheckerStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
