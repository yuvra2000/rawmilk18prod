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
      alert('Please select a row first.');
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
    const isConfirmed = window.confirm('Are you sure you want to delete LECI?');
    if (isConfirmed) {
      console.log('User selected: YES');
    } else {
      console.log('User selected: NO');
    }
  }
}
