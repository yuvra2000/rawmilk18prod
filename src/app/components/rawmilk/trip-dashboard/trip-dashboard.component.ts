import { Component, inject, signal } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-trip-dashboard',
  standalone: true,
  imports: [FilterComponent, NgSelectModule],
  templateUrl: './trip-dashboard.component.html',
  styleUrl: './trip-dashboard.component.scss',
})
export class TripDashboardComponent {
  router = inject(Router);

  cars = signal([
    { id: 1, name: 'Car 1' },
    { id: 2, name: 'Car 2' },
    { id: 3, name: 'Car 3' },
  ]);

  directdispatch() {
    // Logic to export data to Excel
    this.router.navigate(['/create-dispatch'], {
      state: {
        structuredata: {
          status: 'Create',
          DirectDispatch: true,
        },
      },
    });
    console.log('');
  }
}
