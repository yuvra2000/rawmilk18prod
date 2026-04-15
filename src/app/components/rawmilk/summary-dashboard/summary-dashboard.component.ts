import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryDashboardService } from './summary-dashboard.service';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FilterFormComponent,
  FieldConfig,
} from '../../../shared/components/filter-form/filter-form.component';
import { filterfields, generateGridColumns, dispatchDetailColumns } from './state-service/config';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-summary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
    SharedModule
  ],
  templateUrl: './summary-dashboard.component.html',
  styleUrl: './summary-dashboard.component.scss',
})
export class SummaryDashboardComponent implements OnInit {
  private service = inject(SummaryDashboardService);
  private modalService = inject(UniversalModalService);
  private toastService = inject(AlertService);

  supplierList = signal<any[]>([]);
  plantList = signal<any[]>([]);
  milkTypeList = signal<any[]>([]);

  tableData = signal<any[]>([]);
  dispatchDetailRows = signal<any[]>([]);

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    context: { componentParent: this },
    columns: generateGridColumns([]),
  });

  filterfields = computed<FieldConfig[]>(() =>
    filterfields(this.supplierList(), this.plantList(), this.milkTypeList()),
  );

  ngOnInit(): void {
    this.getDeliveryDashboard();
    this.getMasterData();
  }

  getMasterData() {
    const accessToken = localStorage.getItem('AccessToken') || '';
    const groupId = localStorage.getItem('GroupId') || '';

    const payload = new FormData();
    payload.append('AccessToken', accessToken);
    payload.append('GroupId', groupId);
    payload.append('ForApp', '0');

    this.service.getCreateIndentMaster(payload).subscribe({
      next: (res: any) => {
        if (res) {
          const data = res.Data || res;

          if (data.PlantSupplier) {
            this.supplierList.set(
              data.PlantSupplier.filter((item: any) => item.type == 6),
            );
            this.plantList.set(
              data.PlantSupplier.filter((item: any) => item.type == 3),
            );
          }

          if (data.Milk) {
            this.milkTypeList.set(data.Milk);
          }

          if (res.PlantHeader && Array.isArray(res.PlantHeader)) {
            const cols = generateGridColumns(res.PlantHeader);
            this.gridConfig.update((conf) => ({ ...conf, columns: cols }));
          }

          if (res.Data && Array.isArray(res.Data)) {
            this.tableData.set(res.Data);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching master data:', err);
      },
    });
  }

  getDeliveryDashboard(filterData?: any) {
    const accessToken = localStorage.getItem('AccessToken') || '';

    const payload = new FormData();
    payload.append('AccessToken', accessToken);
    payload.append('ForWeb', '1');
    payload.append('FromDate', filterData?.fromDate || '');
    payload.append('ToDate', filterData?.toDate || '');
    payload.append('Supplier', filterData?.supplier || '');
    payload.append('Plant', filterData?.plant || '');
    payload.append('MilkType', filterData?.milkType || '');

    this.service.getDeliveryDashboard(payload).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.PlantHeader && Array.isArray(res.PlantHeader)) {
            const cols = generateGridColumns(res.PlantHeader);
            this.gridConfig.update((conf) => ({ ...conf, columns: cols }));
          }

          if (res.Data && Array.isArray(res.Data)) {
            this.tableData.set(res.Data);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching delivery dashboard:', err);
      },
    });
  }

  onFormSubmit(data: any) {
    this.getDeliveryDashboard(data);
  }

  showDispatchDetails(rowData: any, plantName: string, dispatchIds: any[]) {
    const accessToken = localStorage.getItem('AccessToken') || '';

    if (!dispatchIds || dispatchIds.length === 0) {
      this.toastService.info('No dispatch records found for this plant');
      return;
    }

    const payload = new FormData();
    payload.append('AccessToken', accessToken);
    payload.append('ForWeb', '1');
    payload.append('DispatchIds', JSON.stringify(dispatchIds));

    this.dispatchDetailRows.set([]);

    this.service.getDeliveryQtyPopup(payload).subscribe({
      next: (res: any) => {
        if (res.Status === 'success') {
          const data = res.Data || [];
          if (data.length > 0) {
            this.dispatchDetailRows.set(data);
            this.modalService.openGridModal({
              title: `Dispatch Details - ${rowData.Supplier} → ${plantName}`,
              columns: dispatchDetailColumns,
              rowData: this.dispatchDetailRows(),
              size: 'lg',
            });
          } else {
            this.toastService.info('No dispatch data found');
          }
        } else {
          this.toastService.error(res.Message || 'Error fetching dispatch details');
        }
      },
      error: (error: any) => {
        this.toastService.error(error.message || 'Error fetching dispatch details');
      },
    });
  }
}
