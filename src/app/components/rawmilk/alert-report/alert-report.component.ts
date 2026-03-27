import { Component, signal, computed } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent, Option } from '../../../shared/components/filter-form/filter-form.component';
import { reportAlertReportFilterField } from './state-service/config';
import { AlertReportService } from './alert-report.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';

@Component({
  selector: 'app-alert-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent],
  templateUrl: './alert-report.component.html',
  styleUrl: './alert-report.component.scss'
})
export class AlertReportComponent {
  token = localStorage.getItem('AccessToken') || '';
  constructor(private alertReportService: AlertReportService) { }

  mpcName = signal<Option[]>([]);
  filterfields = computed<FieldConfig[]>(() => reportAlertReportFilterField(this.mpcName()));

  ngOnInit() {
    const payload = {
      AccessToken: this.token,
      GroupId: Number(localStorage.getItem('GroupId')) || 0,
      ForWeb: 1,
    };
    console.log("payload", payload);
    this.alertReportService.getMpcName(payload).subscribe((res: any) => {
      console.log("res", res);
      res.PlantSupplier.forEach((item: any) => {
        if (item.type === 6) {
          this.mpcName.set([...this.mpcName(), item]);
        }
      })
      console.log("mpcName", this.mpcName());
    });
  }

  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
  }
}
