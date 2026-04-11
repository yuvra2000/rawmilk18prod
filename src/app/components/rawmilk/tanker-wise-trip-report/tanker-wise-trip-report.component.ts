import { Component, computed, inject, signal } from '@angular/core';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { alertDetailColumns, chamberDetailColumns, tankerWiseTripReportFilterField, tankerWiseTripReportGridColumn } from './state-service/config';
import { TankerWiseTripReportService } from './tanker-wise-trip-report.service';
import { AlertService } from '../../../shared/services/alert.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-tanker-wise-trip-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, SharedModule],
  templateUrl: './tanker-wise-trip-report.component.html',
  styleUrl: './tanker-wise-trip-report.component.scss'
})
export class TankerWiseTripReportComponent {

  tankerWiseTripReportService = inject(TankerWiseTripReportService);
  token = localStorage.getItem('AccessToken') || '';
  groupId = localStorage.getItem('GroupId') || '';
  private toastService = inject(AlertService);
  private modalService = inject(UniversalModalService);

  // signals
  filterfields = computed<FieldConfig[]>(() => tankerWiseTripReportFilterField(this.tankerNameList(), this.plantNameList(), this.mpcNameList(), this.mccNameList(), this.stopaggesList()));
  tankerNameList = signal<any[]>([]);
  plantNameList = signal<any[]>([]);
  mpcNameList = signal<any[]>([]);
  mccNameList = signal<any[]>([]);
  chamberDetailRows = signal<any[]>([]);
  stopaggesList = signal<any[]>([]);
  tankerWiseTripReportConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelectionMode: 'multiple',
    context: {
      componentParent: this,
    },
    columns: tankerWiseTripReportGridColumn
  });
  tankerWiseTripReportData = signal<any[]>([]);
  alertDetailRows = signal<any[]>([]);

  ngOnInit() {
    this.getTankerName();
    this.getPlantName();
    this.getMccName();
    this.getTableData();
  }

  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    // if report type is "detailed"
    if (data?.reportType?.id === 2) {
      this.getTableData(data, true);
    } else {
      this.getTableData(data, false);
    }
  }

  getTankerName() {
    const payload = {
      AccessToken: this.token,
      ForWeb: 1
    }

    this.tankerWiseTripReportService.getTankerName(payload)
      .subscribe({
        next: (res: any) => {
          this.tankerNameList.set(res.Data);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getPlantName() {
    const payload = {
      AccessToken: this.token,
      GroupId: this.groupId,
      ForApp: 0
    }

    this.tankerWiseTripReportService.getPlantName(payload)
      .subscribe({
        next: (res: any) => {
          // this.plantNameList.set(res.Data);
          res.PlantSupplier.map((item: any) => {
            if (item.type === 3) {
              this.plantNameList.set([...this.plantNameList(), item])
            } else if (item.type === 6) {
              this.mpcNameList.set([...this.mpcNameList(), item])
            }
          })
          this.stopaggesList.set(res?.stoppages || []);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getMccName() {
    const payload = {
      AccessToken: this.token,
      GroupId: this.groupId,
      supplier_id: 1,
      ForApp: 0
    }

    this.tankerWiseTripReportService.getMccName(payload)
      .subscribe({
        next: (res: any) => {
          this.mccNameList.set(res.Data);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getTableData(data?: any, detailedReport: boolean = false) {
    console.log('data', data);
    const formData = createFormData(this.token, {
      "FromDate": data?.from || new Date().toISOString().split('T')[0] + ' 00:00:00',
      "ToDate": new Date(new Date(data?.to || new Date()).setDate(new Date(data?.to || new Date()).getDate() + 1)).toISOString().split('T')[0] + ' 23:55:55',
      "ForWeb": '1',
      "Tanker": data?.stoppageAddress?.vehicle ? data?.tanker?.VehicleNo + ',' + data?.stoppageAddress?.vehicle : data?.tanker?.VehicleNo,
      "Mpc": data?.mpcName?.id,
      "Plant": data?.plant?.id,
      "MCC": data?.mccName?.entity_id,
      "IndentNo": data?.identNumber,
      "DispatchNo": data?.dispatchNumber,
      "Status": data?.status?.id,
      "Trigger": data?.trigger?.id,
      "Remark": data?.remark?.id,
      "Transporter": data?.transporter?.id,
      "ReportType": data?.reportType?.id
    });

    this.tankerWiseTripReportService.getTableData(formData, detailedReport)
      .subscribe({
        next: (res: any) => {
          if (res.Status === 'success') {
            const data = res.Data || [];
            if (data.length > 0) {
              this.tankerWiseTripReportData.set(data);
            } else {
              this.tankerWiseTripReportData.set([]);
              this.toastService.info(res.Message || 'No data found');
            }
          } else {
            console.error('API Error:', res.Message);
            this.tankerWiseTripReportData.set([]);
            this.toastService.error(res.Message || 'Error fetching alert data');
          }
        },
        error: (error: any) => {
          console.error(error);
          this.toastService.error(error.message || 'Error fetching alert data');
        }
      })
  }

  showChamberDetails(dispatchId: any) {

    const payload = {
      AccessToken: this.token,
      DispatchId: dispatchId,
      ForWeb: 1
    }

    this.chamberDetailRows.set([]);

    this.tankerWiseTripReportService.getChamberDetailsByDispatchId(payload).subscribe({
      next: (res: any) => {
        if (res.Status === 'success') {
          const data = res.Data || [];
          if (data.length > 0) {
            this.chamberDetailRows.set(data);
            this.modalService.openGridModal({
              title: `Chamber details`,
              columns: chamberDetailColumns,
              rowData: this.chamberDetailRows(),
            });
          } else {
            this.chamberDetailRows.set([]);
            this.toastService.info(res.Message || 'No data found');
          }
        } else {
          console.error('API Error:', res.Message);
          this.chamberDetailRows.set([]);
          this.toastService.error(res.Message || 'Error fetching alert data');
        }
      },
      error: (error: any) => {
        console.error(error);
        this.toastService.error(error.message || 'Error fetching alert data');
      }
    })



  }

  showAlertDetails(dispatchId: any) {

    const payload = {
      AccessToken: this.token,
      DispatchId: dispatchId,
      ForWeb: 1
    }

    this.alertDetailRows.set([]);

    this.tankerWiseTripReportService.getAlertDetailsByDispatchId(payload).subscribe({
      next: (res: any) => {
        if (res.Status === 'success') {
          const data = res.Data || [];
          if (data.length > 0) {
            this.alertDetailRows.set(data);
            this.modalService.openGridModal({
              title: `Alert details`,
              columns: alertDetailColumns,
              rowData: this.alertDetailRows(),
            });
          } else {
            this.alertDetailRows.set([]);
            this.toastService.info(res.Message || 'No data found');
          }
        } else {
          console.error('API Error:', res.Message);
          this.alertDetailRows.set([]);
          this.toastService.error(res.Message || 'Error fetching alert data');
        }
      },
      error: (error: any) => {
        console.error(error);
        this.toastService.error(error.message || 'Error fetching alert data');
      }
    })
  }
}
