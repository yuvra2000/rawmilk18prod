import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpcTripReportService } from './mpc-trip-report.service';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { mpcFilterFields, mpcGridColumns } from './state-service/config';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Component({
  selector: 'app-mpc-trip-report',
  standalone: true,
  imports: [CommonModule, FilterFormComponent, CollapseWrapperComponent, AdvancedGridComponent],
  templateUrl: './mpc-trip-report.component.html',
  styleUrl: './mpc-trip-report.component.scss'
})
export class MpcTripReportComponent implements OnInit {
  dispatchLocations = signal<any[]>([]);
  plants = signal<any[]>([]);
  tableData = signal<any[]>([]);
  mpcService = inject(MpcTripReportService);
  token: any;

  filterfields = computed<FieldConfig[]>(() => mpcFilterFields(this.dispatchLocations(), this.plants()));

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: mpcGridColumns,
  });

  constructor() { }

  ngOnInit(): void {
    this.token = localStorage.getItem('AccessToken');
    this.loadInitialData();
  }

  loadInitialData(): void {

    const payload = createFormData(this.token, {
      GroupId: localStorage.getItem('GroupId')!,
      ForApp: '0'
    })

    this.mpcService.getIndentMasterDetails(payload).subscribe({
      next: (res: any) => {
        if (res && res.PlantSupplier) {
          const dl = res.PlantSupplier.filter((item: any) => item.type === 4);
          const p = res.PlantSupplier.filter((item: any) => item.type === 3);
          this.dispatchLocations.set(dl);
          this.plants.set(p);
        }
      },
      error: (err: any) => {
        console.error('Error fetching data:', err);
      }
    });
  }

  onFormSubmit(data: any): void {
    console.log('Form Submitted:', data);
    // Handle report generation API call here if needed
  }

  getTableData(formData?: FormData){
    
  }
}
