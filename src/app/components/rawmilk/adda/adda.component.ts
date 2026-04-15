import { Component, OnInit } from '@angular/core';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { AddaStore } from './state-service/store';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-adda',
  standalone: true,
  imports: [AdvancedGridComponent, SharedModule],
  templateUrl: './adda.component.html',
  styleUrl: './adda.component.scss',
})
export class AddaComponent implements OnInit {
  store: AddaStore = new AddaStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
