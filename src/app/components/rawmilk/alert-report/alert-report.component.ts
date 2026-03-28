import { Component, signal, computed } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent, Option } from '../../../shared/components/filter-form/filter-form.component';
import { alertReportGridColumns, reportAlertReportFilterField } from './state-service/config';
import { AlertReportService } from './alert-report.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { map } from 'rxjs';


@Component({
  selector: 'app-alert-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent],
  templateUrl: './alert-report.component.html',
  styleUrl: './alert-report.component.scss'
})
export class AlertReportComponent {
  token = localStorage.getItem('AccessToken') || '';
  constructor(private alertReportService: AlertReportService) { }

  mpcName = signal<Option[]>([]);
  filterfields = computed<FieldConfig[]>(() => reportAlertReportFilterField(this.mpcName()));
  alertRowData = signal<any[]>([]);
  alertConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelectionMode: 'multiple',
    enableRowSelection: true,
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
  }

  handleSelectionChange(selected: any) {
    console.log("handleSelectionChange", selected);
  }

  getMpcName() {
    const payload = {
      AccessToken: this.token,
      GroupId: Number(localStorage.getItem('GroupId')) || 0,
      ForWeb: 1,
    };
    console.log("payload", payload);
    this.alertReportService.getMpcName(payload).subscribe((res) => {
      console.log("res", res);
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
    const defaultPayload = {
      FromDate: '',
      ToDate: '',
      AccessToken: this.token,
      ForWeb: '1',
      AlertType: '',
      MpcId: ''
    };

    this.alertReportService.getTableData(payload || defaultPayload)
      .pipe(map(response => response.Data))
      .subscribe((data) => {
        if (data) {
          this.alertRowData.set(data);
        }
      });
  }
}
