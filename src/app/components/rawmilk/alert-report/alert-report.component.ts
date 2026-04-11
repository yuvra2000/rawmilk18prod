import { Component, signal, computed, inject } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent, Option } from '../../../shared/components/filter-form/filter-form.component';
import { alertReportGridColumns, reportAlertReportFilterField } from './state-service/config';
import { AlertReportService } from './alert-report.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { map } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-alert-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, SharedModule],
  templateUrl: './alert-report.component.html',
  styleUrl: './alert-report.component.scss'
})
export class AlertReportComponent {
  token = localStorage.getItem('AccessToken') || '';
  constructor(private alertReportService: AlertReportService) { }

  private toastService = inject(AlertService);


  mpcName = signal<Option[]>([]);
  filterfields = computed<FieldConfig[]>(() => reportAlertReportFilterField(this.mpcName()));
  alertRowData = signal<any[]>([]);
  alertConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelectionMode: 'multiple',
    context: {
      componentParent: this,
    },
    columns: alertReportGridColumns,
  });

  ngOnInit() {
    this.getMpcName();
    this.populateTable();
  }

  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    this.populateTable({
      FromDate: data.from,
      ToDate: data.to,
      AccessToken: this.token,
      ForWeb: '1',
      AlertType: data.alertType?.name,
      MpcId: data.mpcName?.id
    })
  }


  getMpcName() {
    const payload = {
      AccessToken: this.token,
      GroupId: Number(localStorage.getItem('GroupId')) || 0,
      ForWeb: 1,
    };
    console.log("payload", payload);
    this.alertReportService.getMpcName(payload).subscribe((res) => {
      // console.log("res", res);
      if (res && res.PlantSupplier) {
        res.PlantSupplier.forEach((item: any) => {
          if (item.type === 6) {
            this.mpcName.set([...this.mpcName(), item]);
          }
        });
      }
      console.log("mpcName", this.mpcName());
    });
  }

  populateTable(payload?: any) {
    const today = new Date().toISOString().split('T')[0];
    const defaultPayload = {
      FromDate: `${today} 00:00:00`,
      ToDate: `${today} 23:55:55`,
      AccessToken: this.token,
      ForWeb: '1',
      AlertType: '',
      MpcId: ''
    };

    this.alertReportService.getTableData(payload || defaultPayload)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'success') {
            const data = res.Data || [];
            if (data.length > 0) {
              this.alertRowData.set(data);
            } else {
              this.alertRowData.set([]);
              this.toastService.info(res.Message || 'No data found');
            }
          } else {
            console.error('API Error:', res.Message);
            this.alertRowData.set([]);
            this.toastService.error(res.Message || 'Error fetching alert data');
          }
        },
        error: (error) => {
          console.error('Network/Server Error:', error);
          this.toastService.error('Network or Server error occurred');
        }
      });
  }
}
