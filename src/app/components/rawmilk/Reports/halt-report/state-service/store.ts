import { computed, inject, signal } from '@angular/core';
import { GridConfig } from '../../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { filterfields, gridColumns } from './config';
import {
  createFormData,
  GroupId,
  handleApiResponse,
  handleSessionExpiry,
  mapVehicleListToOptions,
  token,
  userType,
} from '../../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UniversalModalService } from '../../../../../shared/services/universal-modal.service';
import { HaltReportService } from '../halt-report.service';

interface InitialData {
  threshold?: any;
  vehicleList?: any[];
  reportData?: any[];
  geoFenceList?: any[];
}

interface FilterChangeEvent {
  controlName: string;
  value: any;
  form: any;
}

export class HaltReportStore {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private haltReportService = inject(HaltReportService);
  private modal = inject(UniversalModalService);
  date = signal<string>('');
  lastFilterValues = signal<any>(null);
  loading = signal(false);
  initialData = signal<InitialData>({
    vehicleList: [],
    reportData: [],
    geoFenceList: [],
    threshold: 300,
  });
  rowData = computed<any[]>(() => this.initialData().reportData || []);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().vehicleList,
      this.initialData().geoFenceList,
    ),
  );
  columnConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: gridColumns,
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    context: {
      componentParent: this,
    },
    height: '300px',
  }));

  async onFormSubmit(data: any) {}
  async loadInitialData() {
    this.spinner.show();
    this.loading.set(true);
    try {
      const params = createFormData(token, {});
      const res: any = await firstValueFrom(
        this.haltReportService.initializePageData(params),
      );

      this.initialData.set({
        vehicleList: mapVehicleListToOptions(res.vehicleList?.VehicleList),
        geoFenceList: res?.geofenceList?.Data || [],
      });
    } catch (error: any) {
      console.log('Error loading initial data:', error);
      this.toast.error(error?.error?.message || 'Error loading initial data:');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }
  async onFilterChange(event: FilterChangeEvent) {
    if (!event?.form) return;

    const { controlName, form } = event;
    const selectedVehicles = this.normalizeVehicleSelection(
      form.get('vehicle_imei')?.value,
    );
    console.log('Selected vehicles', selectedVehicles);
    const maxHours = this.getMaxAllowedHours(selectedVehicles);
    console.log('Max hours', maxHours);
    if (controlName === 'vehicle_imei') {
      this.validateDateRangeOnVehicleChange(form, maxHours);
      return;
    }

    if (controlName === 'from' || controlName === 'to') {
      this.validateDateRange(form, maxHours);
    }
  }

  private normalizeVehicleSelection(value: any): any[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private validateDateRangeOnVehicleChange(form: any, maxHours: number): void {
    const fromTime = form.get('from')?.value;
    const toTime = form.get('to')?.value;

    if (!fromTime || !toTime) return;

    const diffHours = this.calculateHourDifference(fromTime, toTime);
    if (diffHours > maxHours) {
      this.toast.warning(
        `Now only ${maxHours} hours allowed due to vehicle selection.`,
      );
      form.get('to')?.setValue(null);
      form.get('to')?.markAsTouched();
    }
  }

  private validateDateRange(form: any, maxHours: number): void {
    const fromTime = form.get('from')?.value;
    const toTime = form.get('to')?.value;

    if (!fromTime || !toTime) return;

    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return;

    if (toDate < fromDate) {
      this.toast.warning('To Date must be greater than or equal to From Date.');
      form.get('to')?.setValue(null);
      form.get('to')?.markAsTouched();
      return;
    }

    const diffHours = this.calculateHourDifference(fromTime, toTime);
    if (diffHours > maxHours) {
      this.toast.warning(`The date range cannot exceed ${maxHours} hours.`);
      form.get('to')?.setValue(null);
      form.get('to')?.markAsTouched();
    }
  }

  private calculateHourDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return diffTime / (1000 * 60 * 60);
  }

  private getMaxAllowedHours(selectedVehicles: any[]): number {
    return selectedVehicles.length > 2 ? 48 : 168;
  }
}
