import { Component, computed, OnInit, signal } from '@angular/core';
import { getTripSummaryFilterFields } from './state-service/config';
import { TripSummaryReportService } from './trip-summary-report.service';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Component({
  selector: 'app-trip-summary-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent],
  templateUrl: './trip-summary-report.component.html',
  styleUrl: './trip-summary-report.component.scss'
})
export class TripSummaryReportComponent implements OnInit {

  // API Lists
  tankerList = signal<any[]>([]);
  mpcList = signal<any[]>([]);
  plantList = signal<any[]>([]);
  mccList = signal<any[]>([]);

  // Computed fields
  filterfields = computed<FieldConfig[]>(() =>
    getTripSummaryFilterFields(
      this.tankerList(),
      this.mpcList(),
      this.plantList(),
      this.mccList()
    )
  );

  // Computing default dates
  today = new Date();
  yesterday = new Date(this.today);

  // Authentication Data
  token = '';
  groupId = '';

  initialFilterData: any;

  constructor(private tripSummaryService: TripSummaryReportService) {
    this.yesterday.setDate(this.today.getDate() - 1);
    const formatDate = (d: Date) => {
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // format yyyy-mm-dd
    };

    this.initialFilterData = {
      fromDate: formatDate(this.yesterday),
      toDate: formatDate(this.today)
    };
  }

  ngOnInit() {
    this.token = localStorage.getItem('AccessToken') || '';
    this.groupId = localStorage.getItem('GroupId') || '';

    const authParams = {
      AccessToken: this.token,
      GroupId: this.groupId
    };

    this.tripSummaryService.getFilterOptions(authParams).subscribe({
      next: (res: any) => {
        // Handle tanker list
        if (res.tankerData && res.tankerData.Status === 'success') {
          this.tankerList.set(res.tankerData.Data || []);
        }

        // Handle mpc & plant list (type 6 & type 3)
        if (res.masterData && res.masterData.Status === 'success') {
          const allSuppliers = res.masterData.PlantSupplier || [];
          this.mpcList.set(allSuppliers.filter((item: any) => item.type === 6));
          this.plantList.set(allSuppliers.filter((item: any) => item.type === 3));
        }

        // Handle mcc list
        if (res.mccData && res.mccData.Status === 'success') {
          this.mccList.set(res.mccData.Data || []);
        }
      },
      error: (err) => {
        console.error('Error fetching filter options', err);
      }
    });
  }

  onFormSubmit(data: any): void {
    console.log('Filter form submitted with data:', data);
    
    const formData = createFormData(this.token, {
      FromDate: data?.fromDate || '',
      ToDate: data?.toDate || '',
      SupplierId: data?.mpc?.id || '',
      PlantId: data?.plant?.id || '',
      TankerId: data?.tanker?.VehicleId || '',
      MccId: data?.mcc?.MccId || '',
      IndentNo: data?.indentNo || '',
      DispatchNumber: data?.dispatchNumber || '',
      Status: data?.status?.id || '',
      Trigger: data?.trigger?.id || '',
      Transporter: data?.transporter?.id || '',
    });

    // TODO: Need to define `getTripSummaryReport` in `trip-summary-report.service.ts`
    // this.tripSummaryService.getTripSummaryReport(formData).subscribe({ ... });
  }

  onFilterChange(event: any): void {
    // If we need dependent dropdowns, handle controlValueChange
  }
}

