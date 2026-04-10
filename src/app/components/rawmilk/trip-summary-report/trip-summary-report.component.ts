import { Component, computed, OnInit, signal } from '@angular/core';
import { getTripSummaryFilterFields, tripSummaryGridColumns, tripDetailColumns } from './state-service/config';
import { TripSummaryReportService } from './trip-summary-report.service';
import { FieldConfig, FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { ToastrService } from 'ngx-toastr';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';

@Component({
  selector: 'app-trip-summary-report',
  standalone: true,
  imports: [CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent],
  templateUrl: './trip-summary-report.component.html',
  styleUrl: './trip-summary-report.component.scss'
})
export class TripSummaryReportComponent implements OnInit {

  // API Lists
  tankerList = signal<any[]>([]);
  mpcList = signal<any[]>([]);
  plantList = signal<any[]>([]);
  mccList = signal<any[]>([]);

  // Grid signals
  tableData = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: tripSummaryGridColumns,
    rowSelectionMode: 'multiple',
    context: {
      componentParent: this,
    },
  });

  // Computed fields
  filterfields = computed<FieldConfig[]>(() =>
    getTripSummaryFilterFields(
      this.tankerList(),
      this.mpcList(),
      this.plantList(),
      this.mccList()
    )
  );

  // Computing default dates
  today = new Date();
  tomorrow = new Date(this.today);

  // Authentication Data
  token = '';
  groupId = '';

  initialFilterData: any;

  constructor(
    private tripSummaryService: TripSummaryReportService, 
    private toastService: ToastrService,
    private modalService: UniversalModalService
  ) {
    this.tomorrow.setDate(this.today.getDate() + 1);
    const formatDate = (d: Date) => {
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // format yyyy-mm-dd
    };

    console.log("Setting initial Filter Data", formatDate(this.today), formatDate(this.tomorrow));
    this.initialFilterData = {
      fromDate: formatDate(this.today),
      toDate: formatDate(this.tomorrow)
    };
  }

  ngOnInit() {
    this.token = localStorage.getItem('AccessToken') || '';
    this.groupId = localStorage.getItem('GroupId') || '';

    const tankerParams = createFormData(this.token, { ForWeb: '1' });
    const mpcPlantParams = createFormData(this.token, { GroupId: this.groupId, ForApp: '0' });
    const mccParams = createFormData(this.token, { GroupId: this.groupId, ForApp: '0' });

    this.tripSummaryService.getFilterOptions(tankerParams, mpcPlantParams, mccParams).subscribe({
      next: (res: any) => {
        // Handle tanker list
        if (res.tankerData && res.tankerData.Status === 'success') {
          this.tankerList.set(res.tankerData.Data || []);
        }

        // Handle mpc & plant list (type 6 & type 3)
        if (res.masterData && res.masterData.Status === 'success') {
          const allSuppliers = res.masterData.PlantSupplier || [];
          this.mpcList.set(allSuppliers.filter((item: any) => item.type === 6));
          this.plantList.set(allSuppliers.filter((item: any) => item.type === 3));
        }

        // Handle mcc list
        if (res.mccData && res.mccData.Status === 'success') {
          this.mccList.set(res.mccData.Data || []);
        }
      },
      error: (err) => {
        console.error('Error fetching filter options', err);
      }
    });

    // We shouldn't automatically getTableData yet, since getFilterOptions above is asynchronous. 
    // Usually it's preferable to map it to initialFilterData inside onFormSubmit implicitly when the form gets rendered.
    // If you explicitly want to call getTableData with initialData initially, here:
    setTimeout(() => {
      this.getTableData(this.initialFilterData);
    });
  }

  getTableData(data: any): void {
    this.isLoading.set(true);
    
    // Format parameters mapping from your fields
    const formData = createFormData(this.token, {
      FromDate: data?.fromDate || '',
      ToDate: data?.toDate || '',
      ForWeb: '1',
      Mpc: data?.mpc?.id || '',
      Plant: data?.plant?.id || '',
      Tanker: data?.tanker?.VehicleId || '',
      MCC: data?.mcc?.MccId || '',
      IndentNo: data?.indentNo || '',
      DispatchNo: data?.dispatchNumber || '',
      Status: data?.status?.id || '',
      Trigger: data?.trigger?.id || '',
      Transporter: data?.transporter?.id || '',
      Remark: data?.remark || '',
    });

    this.tripSummaryService.getTripSummaryReport(formData).subscribe({
      next: (res: any) => {
        this.isLoading.set(false);
        if (res.Status === 'success') {
          this.tableData.set(res.Data || []);
          if (res.Data?.length === 0) {
            this.toastService.info(res.Message || 'No data found');
          }
        } else {
          this.tableData.set([]);
          this.toastService.error(res.Message || 'Error fetching data');
        }
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.tableData.set([]);
        this.toastService.error(error.message || 'Error fetching data');
      }
    });
  }

  onFormSubmit(data: any): void {
    console.log('Filter form submitted with data:', data);
    this.getTableData(data);
  }

  onFilterChange(event: any): void {
    // If we need dependent dropdowns, handle controlValueChange
  }

  onTripClick(data: any, column: string): void {
    console.log('Row clicked! Here is the data object:', data);
    console.log('Looking for array related to column:', column);

    let title = 'Trip Details';
    let rowData: any[] = [];

    // Fallback logic to find the nested arrays if they exist
    if (column === 'total_trips') {
      title = 'Total Trips';
      rowData = data.total_tripsArr || [];
    } else if (column === 'inactive_trips') {
      title = 'Inactive Trips';
      rowData = data.inactive_tripsArr || [];
    } else if (column === 'non_lock_trips') {
      title = 'Non Lock Trips';
      rowData = data.non_lock_tripsArr || [];
    } else if (column === 'lid_alert_trips') {
      title = 'Lid Alert Trips';
      rowData = data.lid_alert_tripsArr || [];
    }

    // Default formatting if the user provided selectedTrips somehow
    if (!rowData || rowData.length === 0) {
       if (data.details && Array.isArray(data.details)) {
         rowData = data.details;
       } else if (data.trip_list && Array.isArray(data.trip_list)) {
         rowData = data.trip_list;
       }
    }

    this.modalService.openGridModal({
      title: `${title} for ${data.vehicle_no || 'Vehicle'}`,
      columns: tripDetailColumns,
      rowData: rowData || [],
      size: 'xl'
    });
  }
}


