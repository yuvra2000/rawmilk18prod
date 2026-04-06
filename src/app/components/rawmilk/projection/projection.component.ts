import { Component, OnInit, computed, inject } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { ProjectionStore } from './state-service/store';
import { NavTabComponent } from '../../../shared/components/nav-tab/nav-tab.component';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { addProjectionFields } from './state-service/config';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ProjectionService } from './projection.service';

@Component({
  selector: 'app-projection',
  standalone: true,
  imports: [
    FilterFormComponent,
    AdvancedGridComponent,
    CollapseWrapperComponent,
    NavTabComponent,
  ],
  templateUrl: './projection.component.html',
  styleUrl: './projection.component.scss',
})
export class ProjectionComponent implements OnInit {
  store: ProjectionStore = new ProjectionStore();
  private modalService = inject(UniversalModalService);
  private projectionService = inject(ProjectionService);
  initialData$ = this.store.initialDataf;
  token = localStorage.getItem('AccessToken') || '';
  constructor() {}

  ngOnInit(): void {
    this.store.loadInitialData();
  }
  async onFormSubmit(filterValues: any) {
    this.store.onFormSubmit(filterValues);
  }
  onFilterChange(changedValues: any) {
    console.log('Filter changed:', changedValues);
    if (changedValues?.controlName === 'supplier') {
    }
  }

  /**
   * Generate 8 projection dates starting from projectEndDate + 1 day
   */
  private generateProjectionDates(projectEndDate: string): any[] {
    const projections: any[] = [];

    // Validate and parse the projectEndDate
    let startDate: Date;
    debugger;
    if (
      !projectEndDate ||
      typeof projectEndDate !== 'string' ||
      projectEndDate.trim() === ''
    ) {
      console.warn(
        "Invalid projectEndDate provided, using today's date as fallback",
        projectEndDate,
      );
      startDate = new Date();
    } else {
      startDate = new Date(projectEndDate.trim());

      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        console.warn(
          'Could not parse projectEndDate:',
          projectEndDate,
          "using today's date as fallback",
        );
        startDate = new Date();
      }
    }

    // Generate 8 dates starting from +1 day
    for (let i = 1; i <= 8; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Format as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      projections.push({
        date: formattedDate,
        quantity: '', // Empty for user to fill
      });
    }

    return projections;
  }
  endDate = computed(() => {
    return this.store.initialData().PrjAddEndDate;
  });

  openAddProjectionMulti() {
    // Get projectEndDate from store
    debugger;

    console.log('Initial Data from Store:', this.store.initialData());
    const projectEndDate = this.store.initialData().PrjAddEndDate;

    // Generate 8 projection dates
    const generatedProjections = this.generateProjectionDates(projectEndDate);
    console.log('Generated Projection Dates:', generatedProjections);
    this.modalService.openForm({
      title: 'Add Projection',
      fields: addProjectionFields(
        this.store.initialData().mccList,
        this.store.initialData().milkList,
      ),
      mode: 'form',
      showFormArrayButtons: false,
      initialData: {
        projections: generatedProjections, // Pass pre-generated dates
      },
      onSave: async (form: any) => {
        console.log('Form submitted:', form);
      },
    });
  }
}
