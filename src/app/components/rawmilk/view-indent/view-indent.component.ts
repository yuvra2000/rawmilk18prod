import { Component, signal } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-view-indent',
  standalone: true,
  imports: [FilterComponent, NgSelectModule],
  templateUrl: './view-indent.component.html',
  styleUrl: './view-indent.component.scss'
})
export class ViewIndentComponent {
  cars = signal([
    { id: 1, name: 'Car 1' },
    { id: 2, name: 'Car 2' },
    { id: 3, name: 'Car 3' }
  ]);
}
