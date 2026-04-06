import { Component, OnInit } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { DispatchPlanningStore } from './state-service/store';

@Component({
  selector: 'app-dispatch-planning',
  standalone: true,
  imports: [FilterFormComponent],
  templateUrl: './dispatch-planning.component.html',
  styleUrl: './dispatch-planning.component.scss',
})
export class DispatchPlanningComponent implements OnInit {
  store: DispatchPlanningStore = new DispatchPlanningStore();
  ngOnInit(): void {
    this.store.loadInitialData();
  }
}
