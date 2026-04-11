import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { leciFilterFields, leciReportColumns } from './state-service/config';
import { LeciReportService } from './leci-report.service';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-leci-report',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, SharedModule],
  templateUrl: './leci-report.component.html',
  styleUrl: './leci-report.component.scss'
})
export class LeciReportComponent implements OnInit {
  private service = inject(LeciReportService);
  private toast = inject(ToastrService);
  private token: any;

  mpcList = signal<any[]>([]);
  mccList = signal<any[]>([]);
  tableData = signal<any[]>([]);

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: leciReportColumns,
    pagination: true,
    paginationPageSize: 20,
    enableExport: true,
    enableSearch: true,
    context: {
      componentParent: this,
    },
  });

  filterfields = computed<FieldConfig[]>(() =>
    leciFilterFields(this.mpcList(), this.mccList())
  );

  ngOnInit() {
    this.token = localStorage.getItem('AccessToken');
    this.getMpcAndMcc();
    this.getTableData();
  }

  getMpcAndMcc() {
    const formData = createFormData(this.token, {
      "GroupId": localStorage.getItem('GroupId')!,
      "ForWeb": '0',
    });
    this.service.getIndentMasterData(formData).subscribe({
      next: (res: any) => {
        if (res && res.PlantSupplier && Array.isArray(res.PlantSupplier)) {
          const items = res.PlantSupplier;
          this.mpcList.set(items.filter((item: any) => item.type === 6));
          this.mccList.set(items.filter((item: any) => item.type === 4));
        }
      },
      error: (err) => {
        console.error('Error fetching indent master data:', err);
      }
    });
  }

  onFormSubmit(data: any) {
    console.log('Filter Submitted:', data);

    this.getTableData(data);
  }

  getTableData(data?: any) {
    const payload = createFormData(this.token, {
      FromDate: data?.fromDate || '',
      ToDate: data?.toDate || '',
      ForWeb: '1',
      MCC: data?.mcc || '',
      MPC: data?.mpc || '',
    });

    this.service.getLeciReport(payload).subscribe({
      next: (res: any) => {
        if (res.Status === 'success') {
          this.tableData.set(res.Data || []);
          if (!res.Data || res.Data.length === 0) {
            this.toast.info('No data found');
          }
        } else {
          this.tableData.set([]);
          this.toast.error(res.Message || 'Failed to fetch report data');
        }
      },
      error: (err: any) => {
        console.error('Error fetching report:', err);
        this.toast.error('Something went wrong. Please try again.');
      }
    });
  }

  sendEmail() {
    // take email from browser alert
    const email = prompt('Enter email address:');
    if (email) {
      const payload = createFormData(this.token, {
        ForWeb: '1',
        ToEmailId: email,
        MCC: '',
        MPC: '',
        FromDate: '',
        ToDate: '',
      });
      this.service.sendEmail(payload).subscribe({
        next: (res: any) => {
          if (res.Status === 'success') {
            this.toast.success(res.Message || 'Email sent successfully');
          } else {
            this.toast.error(res.Message || 'Failed to send email');
          }
        },
        error: (err: any) => {
          console.error('Error sending email:', err);
          this.toast.error('Something went wrong. Please try again.');
        }
      });
    }

  }
}
