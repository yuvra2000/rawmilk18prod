import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { leciDashboardFilterFields, leciDashboardColumns, alertDetailColumns } from './state-service/config';
import { LeciDashboardService } from './leci-dashboard.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { SharedModule } from '../../../shared/shared.module';
import { MapLoader } from './state-service/map.loader';
import { AlertService } from '../../../shared/services/alert.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-leci-dashboard',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, SharedModule],
  templateUrl: './leci-dashboard.component.html',
  styleUrl: './leci-dashboard.component.scss'
})
export class LeciDashboardComponent implements OnInit {
  private service = inject(LeciDashboardService);
  private modalService = inject(UniversalModalService);
  private router = inject(Router);
   private mapLoader = inject(MapLoader);
   private alertService = inject(AlertService);

  supplierList = signal<any[]>([]);
  plantList = signal<any[]>([]);
  transportList = signal<any[]>([]);
  mccList = signal<any[]>([]);

  tableData = signal<any[]>([]);
  selectedRow = signal<any>(null);
  isLoading = signal(false);

  // Summary stats from API
  totalVehicle = signal(0);
  running = signal(0);
  inActive = signal(0);
  stopped = signal(0);
  atSource = signal(0);
  atDestination = signal(0);

  filterfields = computed<FieldConfig[]>(() =>
    leciDashboardFilterFields(
      this.supplierList(),
      this.plantList(),
      this.transportList(),
      this.mccList()
    )
  );

  gridConfig = signal<GridConfig>({
    Title: 'leci-dashboard-report',
    theme: 'alpine',
    height: '600px',
    columns: leciDashboardColumns,
    context: { componentParent: this },
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    rowHeight: 42,
    enableRowSelection: true,
    rowSelectionMode: 'single'
  });

  ngOnInit() {
    this.loadFilterDropdowns();
    const today = new Date().toISOString().split('T')[0];
    this.loadDashboardData({ fromDate: today, toDate: today });
  }

  loadFilterDropdowns() {
    const groupId = localStorage.getItem('GroupId') || '';
    const token = localStorage.getItem('AccessToken') || '';

    const indentPayload = createFormData(token, {
      GroupId: groupId,
      ForApp: '0',
    });

    const tankerPayload = createFormData(token, {
      ForWeb: '1',
    });

    this.service.getFilterDropdowns(indentPayload, tankerPayload).subscribe({
      next: (result) => {
        const plantSupplier = result.indentMaster?.PlantSupplier ?? [];
        this.supplierList.set(plantSupplier.filter((item: any) => item.type === 6));
        this.plantList.set(plantSupplier.filter((item: any) => item.type === 3));
        this.mccList.set(plantSupplier.filter((item: any) => item.type === 4));
        this.transportList.set(result.tankerFilter?.TransporterList ?? []);
      },
      error: (err) => {
        console.error('Error loading filter dropdowns:', err);
      }
    });
  }

  loadDashboardData(filterData?: any) {
    this.isLoading.set(true);
    const token = localStorage.getItem('AccessToken') || '20ed2405F0Tg162E648votK524c7H940';

    const payload = createFormData(token, {
      ForApp: '0',
      FromDate: filterData?.fromDate || '',
      ToDate: filterData?.toDate || '',
      Supplier: filterData?.supplier?.id || '',
      Plant: filterData?.plant?.id || '',
      Transporter: filterData?.transport?.id || '',
      Mcc: filterData?.mcc?.id || '',
      report_data: filterData?.type?.name,
    });

    this.service.getLeciDashboardData(payload).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res?.Status === 'success') {
          this.tableData.set(res.Data || []);
          this.totalVehicle.set(res.totalVehicle ?? 0);
          this.running.set(res.Running ?? 0);
          this.inActive.set(res.InActive ?? 0);
          this.stopped.set(res.Stopped ?? 0);
          this.atSource.set(res.atSource ?? 0);
          this.atDestination.set(res.atDestination ?? 0);
        } else {
          this.tableData.set([]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  onFormSubmit(data: any) {
    this.loadDashboardData(data);
  }

  /**
   * Called by AlertsCellRendererComponent when an alert badge is clicked.
   * Opens a grid modal showing all rows for that alert type.
   */
  onAlertClick(alertType: string, items: any[], rowData: any): void {
    // Normalize: attach alert_type to each item if missing
    const normalizedItems = items.map(item => ({
      ...item,
      alert_type: item.alert_type || alertType,
    }));

    this.modalService.openGridModal({
      title: `${alertType} Alerts`,
      subtitle: `${rowData?.vehicle_no || ''} — ${rowData?.ChallanNo || ''} — ${normalizedItems.length} record(s)`,
      columns: alertDetailColumns,
      rowData: normalizedItems,
      size: 'xl',
      showFooter: true,
      showCloseButton: true,
      cancelText: 'Close',
      height: '55vh',
    }).catch(() => { /* dismissed */ });
  }
  onSelectionChanged(rows: any[]) {
    this.selectedRow.set(rows.length > 0 ? rows[0] : null);
  }

  addNewLeci() {
    const row = this.selectedRow();
    console.log('selected row', row);
    if (!row) {
      this.alertService.warning('Please select a row first.');
      return;
    }
    const isConfirmed = window.confirm('Are you sure you want to add new LECI?');
    if (isConfirmed) {
      this.router.navigate(['/leci-add-form'], {
        state: {
          dispatchid: row.id,
          chamber_no: row.chamber
        }
      });
    }
  }

  deleteLeci() {
    const row = this.selectedRow();
    if (!row) {
      this.alertService.warning('Please select a row first.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to Going to Delete this Report?');
    if (!isConfirmed) return;

    const token = localStorage.getItem('AccessToken') || '';
    const payloadPre = createFormData(token, {
      dispatchid: String(row.id || ''),
      chamber_no: String(row.chamber || ''),
      ForApp: '0'
    });

    this.service.checkLeciPre(payloadPre).subscribe({
      next: (res: any) => {
        if (res?.alreadySubmited === 'YES') {
          this.modalService.openForm({
            title: 'Delete LECI Report',
            mode: 'form',
            size: 'md',
            fields: [
              {
                name: 'remark',
                type: 'textarea',
                label: 'Remark',
                placeholder: 'Enter reason for deletion',
                required: true,
                class: 'col-12'
              }
            ],
            onSave: async (formData) => {
              const deletePayload = createFormData(token, {
                dispatchId: String(row.id || ''),
                chamber_no: String(row.chamber || ''),
                ForApp: '0',
                remark: formData.remark
              });
              return firstValueFrom(this.service.deleteLeciReport(deletePayload));
            }
          }).then((modalRes) => {
            if (modalRes?.Status === 'success' || modalRes?.status === 1) {
              this.alertService.success(modalRes?.Message || 'Successfully deleted.');
              // Refresh data after successful deletion
              const today = new Date().toISOString().split('T')[0];
              this.loadDashboardData({ fromDate: today, toDate: today });
            } else if (modalRes) {
              // Assume if modalRes exists but isn't success, it's an error from the API
              this.alertService.error(modalRes?.Message || 'Failed to delete report.');
            }
          }).catch(() => {
            // Modal was dismissed or closed without saving, do nothing
          });
        } else {
          this.alertService.warning('There Is No Details Found In This dispatch');
        }
      },
      error: (err) => {
        this.alertService.error('Error validating report deletion.');
        console.error('API Error:', err);
      }
    });
  }

  onVehicleClick(event: any) {
    console.log('Vehicle clicked:', event);
    this.mapLoader.openMapCallApi(event);
  }
}
