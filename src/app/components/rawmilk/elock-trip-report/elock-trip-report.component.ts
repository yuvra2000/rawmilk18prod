
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { elockFilterFields } from './state-service/config';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { ElockTripReportService } from './elock-trip-report.service';
import { AlertService } from '../../../shared/services/alert.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Component({
  selector: 'app-elock-trip-report',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent],
  templateUrl: './elock-trip-report.component.html',
  styleUrl: './elock-trip-report.component.scss'
})
export class ElockTripReportComponent implements OnInit {
  token: string = localStorage.getItem('AccessToken') || '';
  
  vehicleList = signal<any[]>([]);
  filterfields = computed<FieldConfig[]>(() => elockFilterFields(this.vehicleList()));

  initialData = {
    fromDate: '2026-04-01T00:00',
    toDate: '2026-04-01T00:00',
    otpFor: { id: 'All', name: 'All' },
    status: { id: 'All', name: 'All' }
  };

  reportData: any[] = [];

  constructor(
    private elockService: ElockTripReportService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    const payload = createFormData(this.token, {
      ForWeb: '1'
    });

    this.elockService.getVehicleList(payload).subscribe({
      next: (res) => {
        if (res?.VehicleList) {
          this.vehicleList.set(Object.values(res.VehicleList));
        } else if (res?.status === 1 || res?.Status === 'success') {
          this.vehicleList.set(res.data || res.Data || []);
        }
      },
      error: (err) => {
        this.alertService.error('Failed to load vehicles');
        console.error('API Error:', err);
      }
    });
  }

  onFormSubmit(formData: any) {
    const payload = createFormData(this.token, {
      FromDate: formData.fromDate,
      ToDate: formData.toDate,
      VehicleNo: String(formData?.vehicleNumber?.VehicleNo || formData?.vehicleNumber?.id || ''),
      OtpFor: formData?.otpFor?.id || 'All',
      Status: formData?.status?.id || 'All',
      ForWeb: '1'
    });

    // TODO: implement report API call
    console.log('Filters submitted', formData);
  }
}


