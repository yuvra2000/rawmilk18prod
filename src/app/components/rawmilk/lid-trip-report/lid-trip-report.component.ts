import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent, Option } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { AlertService } from '../../../shared/services/alert.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { lidTripReportFilterFields, lidTripGridColumns } from './state-service/config';
import { LidTripReportService } from './lid-trip-report.service';

@Component({
  selector: 'app-lid-trip-report',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent],
  templateUrl: './lid-trip-report.component.html',
  styleUrl: './lid-trip-report.component.scss'
})
export class LidTripReportComponent implements OnInit {
  private lidTripReportService = inject(LidTripReportService);
  private toastService = inject(AlertService);

  token = localStorage.getItem('AccessToken') || '';
  groupId = localStorage.getItem('GroupId') || '';

  mpcNameList = signal<Option[]>([]);
  responseData = signal<any[]>([]);

  filterfields = computed<FieldConfig[]>(() => lidTripReportFilterFields(this.mpcNameList()));

  initialFilterData = this.getInitialFilterData();

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: lidTripGridColumns,
    excelTitle: 'Lid Trip Report',
  });

  ngOnInit(): void {
    this.loadMpcNameOptions();
    this.getLidTripReport();
  }

  onFormSubmit(data: any): void {
    this.getLidTripReport(data);
  }

  private getInitialFilterData() {
    const today = this.getTodayDate();
    return {
      fromDate: `${today}T00:00:00`,
      toDate: `${today}T23:55:55`,
      lidOpenLocation: { id: 'All', name: 'All' },
    };
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatDateTimeForApi(value: any, defaultTime: string): string {
    const today = this.getTodayDate();

    if (!value) {
      return `${today} ${defaultTime}`;
    }

    const stringValue = String(value).trim();
    if (!stringValue) {
      return `${today} ${defaultTime}`;
    }

    if (stringValue.includes('T')) {
      const [datePart, timePartRaw] = stringValue.split('T');
      const timePart = (timePartRaw || defaultTime).trim();
      if (!timePart) return `${datePart} ${defaultTime}`;
      if (timePart.length === 5) return `${datePart} ${timePart}:00`;
      return `${datePart} ${timePart}`;
    }

    if (stringValue.includes(' ')) {
      const [datePart, timePartRaw] = stringValue.split(' ');
      const timePart = (timePartRaw || defaultTime).trim();
      if (!timePart) return `${datePart} ${defaultTime}`;
      if (timePart.length === 5) return `${datePart} ${timePart}:00`;
      return `${datePart} ${timePart}`;
    }

    return `${stringValue} ${defaultTime}`;
  }

  private loadMpcNameOptions(): void {
    const payload = createFormData(this.token, {
      GroupId: this.groupId,
      ForApp: '0',
    });

    this.lidTripReportService.getIndentMasterDetails(payload).subscribe({
      next: (res: any) => {
        const plantSupplier = Array.isArray(res?.PlantSupplier) ? res.PlantSupplier : [];
        const mpcData = plantSupplier
          .filter((item: any) => item?.type === 6)
          .map((item: any) => ({
            id: item?.id,
            name: item?.name || item?.displayName || '',
          }))
          .filter((item: Option) => !!item.name);

        this.mpcNameList.set(mpcData);
      },
      error: (error: any) => {
        console.error('Error loading MPC names:', error);
      },
    });
  }

  private getLidTripReport(formData?: any): void {
    const payload = createFormData(this.token, {
      FromDate: this.formatDateTimeForApi(formData?.fromDate, '00:00:00'),
      ToDate: this.formatDateTimeForApi(formData?.toDate, '23:55:55'),
      ForWeb: '1',
      MpcId: String(formData?.mpcName?.id || ''),
      LidOpenLocation: String(formData?.lidOpenLocation?.id || 'All'),
    });

    this.lidTripReportService.getLidTripReport(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'success' || res?.Status === 1) {
          const data = Array.isArray(res?.Data) ? res.Data : [];
          this.responseData.set(data);

          if (!data.length) {
            this.toastService.info(res?.Message || 'No data found');
          }
          return;
        }

        this.responseData.set([]);
        this.toastService.error(res?.Message || 'Error fetching lid trip report');
      },
      error: (error: any) => {
        console.error('Error fetching lid trip report:', error);
        this.responseData.set([]);
        this.toastService.error(error?.message || 'Error fetching lid trip report');
      },
    });
  }

}
