import { Component, OnInit, computed, inject } from '@angular/core';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { ProjectionStore } from './state-service/store';
import { NavTabComponent } from '../../../shared/components/nav-tab/nav-tab.component';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { addProjectionFields } from './state-service/config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  supplier_id,
} from '../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ProjectionService } from './projection.service';
import { AlertService } from '../../../shared/services/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  private toast = inject(AlertService);
  private spinner = inject(NgxSpinnerService);
  initialData$ = this.store.initialDataf;
  token = localStorage.getItem('AccessToken') || '';
  constructor() {}

  ngOnInit(): void {
    this.store.loadInitialData();
  }
  async onFormSubmit(filterValues: any) {
    this.store.onFormSubmit(filterValues);
  }
  async onFilterChange(changedValues: any) {
    console.log('Filter changed:', changedValues);
    if (changedValues?.controlName === 'supplier') {
      this.spinner.show();
      try {
        const res: any = await firstValueFrom(
          this.projectionService.getMCCData(
            createFormData(this.token, {
              supplier_id: changedValues.value?.id || '',
              GroupId: GroupId,
              ForApp: '0',
            }),
          ),
        );
        this.store.updateMCCList(res.Data || []);
      } catch (error) {
        console.error('Error fetching MCC data:', error);
      } finally {
        this.spinner.hide();
      }
    }
  }

  /**
   * Generate 8 projection dates starting from projectEndDate + 1 day
   */
  private generateProjectionDates(projectEndDate: string): any[] {
    const projections: any[] = [];

    // Validate and parse the projectEndDate
    let startDate: Date;
    if (
      !projectEndDate ||
      typeof projectEndDate !== 'string' ||
      projectEndDate.trim() === ''
    ) {
      startDate = new Date();
    } else {
      startDate = new Date(projectEndDate.trim());

      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        this.toast.warning('Could not parse projectEndDate:', projectEndDate);
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
    const projectEndDate = this.store.initialData().PrjAddEndDate;
    const generatedProjections = this.generateProjectionDates(projectEndDate);
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
        let formData = createFormData(this.token, {
          MilkId: form.milkType.id || '',
          SupplierId: form.Supplier?.id || '',
          MccId: form.mcc.mcc_id || '',
          ProjectionData: JSON.stringify(form.projections || []),
          ForWeb: '1',
        });
        try {
          const res: any = await firstValueFrom(
            this.projectionService.addProjectionMultiple(formData),
          );
          handleApiResponse(
            res,
            this.toast,
            undefined,
            'Projection added successfully',
            'Failed to add projection',
          );
          this.store.loadInitialData(); // Refresh data after adding
        } catch (error) {
          handleApiResponse(
            null,
            this.toast,
            undefined,
            'Error adding projection',
          );
        }
      },
    });
  }
}
