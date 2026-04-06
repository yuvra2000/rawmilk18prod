import { Component } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { DispatchPlanningStore } from './state-service/store';

@Component({
  selector: 'app-dispatch-planning',
  standalone: true,
  imports: [FilterFormComponent],
  templateUrl: './dispatch-planning.component.html',
  styleUrl: './dispatch-planning.component.scss',
})
export class DispatchPlanningComponent {
  store: DispatchPlanningStore = new DispatchPlanningStore();
}
