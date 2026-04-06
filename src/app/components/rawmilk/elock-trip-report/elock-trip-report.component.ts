
import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { elockFilterFields, gridColumns } from './state-service/config';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { ElockTripReportService } from './elock-trip-report.service';
import { AlertService } from '../../../shared/services/alert.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-elock-trip-report',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent],
  templateUrl: './elock-trip-report.component.html',
  styleUrl: './elock-trip-report.component.scss'
})
export class ElockTripReportComponent implements OnInit {
  token: string = localStorage.getItem('AccessToken') || '';
  
  vehicleList = signal<any[]>([]);
  filterfields = computed<FieldConfig[]>(() => elockFilterFields(this.vehicleList()));

  tableData = signal<any[]>([]);

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: gridColumns,
    pagination: true,
    paginationPageSize: 10,
    enableExport: true,
    enableSearch: true,
    height: '500px',
    context: {
      componentParent: this
    }
  });

  @ViewChild('imageModal') imageModalTemplate!: TemplateRef<any>;
  selectedRowData: any = null;

  constructor(
    private elockService: ElockTripReportService,
    private alertService: AlertService,
    private modalService: UniversalModalService
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
    console.log('Form Data:', formData);
    const payload = createFormData(this.token, {
      from_date: formData.fromDate || '2026-04-06 00:00:00',
      to_date: formData.toDate || '2026-04-06 23:55:55',
      vehicle: formData?.vehicleNumber?.ImeiNo + '$' + formData?.vehicleNumber?.VehicleId,
      otp_for: formData?.otpFor?.id,
      status: formData?.status?.id
    });

    this.elockService.getTableData(payload).subscribe({
      next: (res: any) => {
        if (res && res.Report) {
          this.tableData.set(res.Report || []);
          if (res.Report.length === 0) {
            this.alertService.info(res.Message || 'No data found');
          }
        } else if (res && res.Data) {
          this.tableData.set(res.Data || []);
          if (res.Data.length === 0) {
            this.alertService.info(res.Message || 'No data found');
          }
        } else if (res && Array.isArray(res)) {
          this.tableData.set(res);
        } else {
          this.tableData.set([]);
          this.alertService.error('Error fetching data');
        }
      },
      error: (error: any) => {
        this.alertService.error(error?.message || 'Error fetching data');
      }
    });
  }

  onView(data: any) {
    this.selectedRowData = data;
    
    // Calculate a 15-minute window from the actionTym
    let fromDateStr = data.actionTym;
    let toDateStr = data.actionTym;

    if (data.actionTym) {
      const actionDate = new Date(data.actionTym.replace(/-/g, '/'));
      if (!isNaN(actionDate.getTime())) {
        const fromDate = new Date(actionDate.getTime() - 15 * 60000); // 15 mins before
        const toDate = new Date(actionDate.getTime() + 15 * 60000);   // 15 mins after

        const formatStr = (d: Date) => {
          return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0') + ' ' +
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0') + ':' +
            String(d.getSeconds()).padStart(2, '0');
        };

        fromDateStr = formatStr(fromDate);
        toDateStr = formatStr(toDate);
      }
    }

    const payload = createFormData(this.token, {
      imei: data.imei || data.MobileIMENo,
      from: fromDateStr,
      to: toDateStr,
      type: '0',
      angular: '1'
    });

    this.elockService.getImages(payload).subscribe({
      next: (res: any) => {
        if (res && res.Status === 'success' && res.Data && res.Data.length > 0) {
          const imgData = res.Data[0];
          data.image = imgData.photo;
          data.imgDateTime = imgData.imgDateTime;
          data.imglatlng = imgData.imglatlng;
        } else if (res && res.Data && res.Data.length > 0) {
          data.image = res.Data[0].photo || res.Data[0].url || res.Data[0].ImageURL || res.Data[0].image || res.Data[0].imgUrl;
        } else if (res && res.data && res.data.length > 0) {
          data.image = res.data[0].photo || res.data[0].url || res.data[0].ImageURL || res.data[0].image || res.data[0].imgUrl;
        } else if (res && res.images && res.images.length > 0) {
          data.image = res.images[0];
        } else if (res && Array.isArray(res) && res.length > 0) {
          data.image = res[0].photo || res[0].url || res[0].ImageURL || res[0].image || res[0].imgUrl;
        } else if (res && res.ImageURL) {
          data.image = res.ImageURL;
        } else if (res && res.url) {
          data.image = res.url;
        } else if (res && res.photo) {
          data.image = res.photo;
        }
        
        // Update selectedRowData with the new image URL reference
        this.selectedRowData = { ...data };
        
        this.modalService.openTemplate(this.imageModalTemplate, {
          size: 'lg',
          centered: true,
        });
      },
      error: (err: any) => {
        console.error('Failed to load images', err);
        // Open modal anyway, will fallback to no-image state
        this.modalService.openTemplate(this.imageModalTemplate, {
          size: 'lg',
          centered: true,
        });
      }
    });
  }
}
