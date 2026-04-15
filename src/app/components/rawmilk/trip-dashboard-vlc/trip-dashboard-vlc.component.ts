import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import {
  tripDashboardVLCFilterFields,
  tripDashboardVLCGridColumns,
} from './state-service/config';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { TripDashboardVlcService } from './trip-dashboard-vlc.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Component({
  selector: 'app-trip-dashboard-vlc',
  standalone: true,
  imports: [
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './trip-dashboard-vlc.component.html',
  styleUrl: './trip-dashboard-vlc.component.scss',
})
export class TripDashboardVlcComponent {
  token = signal(localStorage.getItem('AccessToken') || '');
  groupId = signal(localStorage.getItem('GroupId') || '');
  filterfields = computed<FieldConfig[]>(() => tripDashboardVLCFilterFields());
  isLoadingRowData = signal(false);
  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: tripDashboardVLCGridColumns,
    rowSelectionMode: 'multiple',
    context: {
      componentParent: this,
    },
  });

  tripDashboardVlcService = inject(TripDashboardVlcService);

  ngOnInit(){
    this.onFormSubmit();
  }

  onFormSubmit(data?: any) {
    // console.log('Form submitted with data:', data);

    const payload = createFormData(this.token(), {
      group_id: this.groupId(),
      date: data?.date,
      refrigerated_key: data?.refrigeratedType?.id,
      segment: data?.segment?.id,
    });

    console.log('Payload for API:', payload);

    this.getTableData(payload);
  }

  getTableData(payload: any) {
    this.isLoadingRowData.set(true);
    this.tripDashboardVlcService.getTripDashboardTableData(payload).subscribe({
      next: (response: any) => {
        // Handle the response
        console.log('API response:', response);
      },
      error: (error: any) => {
        console.error('Error fetching table data:', error);
      },
      complete: () => {
        this.isLoadingRowData.set(false);
      }
    });

  }
}
