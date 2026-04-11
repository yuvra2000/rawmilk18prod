import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from "../../../shared/components/collapse-wrapper/collapse-wrapper.component";
import { FieldConfig, FilterFormComponent } from "../../../shared/components/filter-form/filter-form.component";
import { filterFields, loadPlanningColumns, statusModalFields, assignedField, actionColumn } from './state-service/config';
import { LoadPlanningService } from './load-planning.service';
import { createFormData, handleApiError, handleApiResponse, updateFieldOptions } from '../../../shared/utils/shared-utility.utils';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { TileComponent } from '../../../shared/components/tile/tile.component';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { firstValueFrom } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-load-planning',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, TileComponent, SharedModule],
  templateUrl: './load-planning.component.html',
  styleUrl: './load-planning.component.scss'
})
export class LoadPlanningComponent implements OnInit {

  private loadPlanningService = inject(LoadPlanningService);
  private modalService = inject(UniversalModalService);
  private toastService = inject(AlertService);

  assignedCount = signal<number>(0);
  breakDownCount = signal<number>(0)
  loadedCount = signal<number>(0)
  notAvailCount = signal<number>(0)
  vacantCount = signal<number>(0)
  vehicleList = signal<any[]>([]);
  transporterList = signal<any[]>([]);
  dispatchLocationList = signal<any[]>([]);
  destinationList = signal<any[]>([]);
  statusModalFieldsSignal = signal<FieldConfig[]>(statusModalFields);
  selectedStatusData = signal<any>(null);

  filterfields = computed<FieldConfig[]>(() => 
    filterFields(
      this.transporterList(),
      this.vehicleList(),
      this.dispatchLocationList(),
      this.destinationList()
    )
  );

  gridConfig = signal<GridConfig>({
    theme: 'alpine',
    columns: [
      ...loadPlanningColumns,
      actionColumn
    ],
    context: {
      componentParent: this,
    },
  });

  tableData = signal<any[]>([]);
  token = localStorage.getItem('AccessToken') || '';

  constructor() {}

  ngOnInit(): void {
    this.fetchMasterData(); this.onFormSubmit({});
  }

  fetchMasterData() {
    const token = localStorage.getItem('AccessToken') || '';
    const groupId = localStorage.getItem('GroupId') || '';

    // Payload for createIndentMaster
    const indentPayload = createFormData(token, {
      GroupId: groupId,
      ForApp: 0
    });

    // Payload for rm_tankerFilter
    const tankerPayload = createFormData(token, {
      GroupId: groupId,
      ForWeb: 1
    });

    // console.log('Fetching master data with payload:', indentPayload);
    this.loadPlanningService.getFilterOptions(indentPayload, tankerPayload).subscribe({
      next: (res: any) => {
        console.log('Master data response:', res);
        
        // 1 & 2: Vehicle No. and Transporter from rm_tankerFilter
        if (res.tankerFilter && res.tankerFilter.Status === 'success') {
          if (res.tankerFilter.TransporterList) {
            this.transporterList.set(res.tankerFilter.TransporterList);
          }
          if (res.tankerFilter.Data) {
            this.vehicleList.set(res.tankerFilter.Data);
          }
        }

        // 3 & 4: Dispatch Location and Destination from createIndentMaster
        if (res.indentMaster && res.indentMaster.Status === 'success') {
          if (res.indentMaster.PlantSupplier) {
            const dispatchLocations = res.indentMaster.PlantSupplier.filter((item: any) => item.type === 4);
            const destinations = res.indentMaster.PlantSupplier.filter((item: any) => item.type === 3);

            this.dispatchLocationList.set(dispatchLocations);
            this.destinationList.set(destinations);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching master data:', err);
      }
    });
  }

  onFormSubmit(data: any) {
    console.log('Filter form submitted with:', data);
    const token = localStorage.getItem('AccessToken') || '';
    
    // Safely mapping form values (handling potential object vs string)
    const payloadData = {
      ForWeb: 1,
      VehicleNum: data.vehicleNo?.VehicleNo || data.vehicleNo || '',
      Transporter: data.transporter?.Id || data.transporter?.id || data.transporter || '',
      Destination: data.destination?.id || data.destination?.Id || data.destination || '',
      CurrentStatus: data.currentStatus?.id || data.currentStatus || '',
      CurrentLoc: '',
      VehicleStatus: data.vehicleStatus?.id || data.vehicleStatus || '',
      DispatchLoc: data.dispatchLocation?.id || data.dispatchLocation?.Id || data.dispatchLocation || ''
    };

    const finalPayload = createFormData(token, payloadData);

    this.loadPlanningService.getLoadPlanningRepo(finalPayload).subscribe({
      next: (res: any) => {
        console.log('Grid Data response:', res);
        if (res.Status === 'success' && res.Data) {
          this.tableData.set(res.Data);
          this.assignedCount.set(res.Counts.Assigned || 0);
          this.breakDownCount.set(res.Counts.BreakDown || 0);
          this.loadedCount.set(res.Counts.Loaded || 0);
          this.notAvailCount.set(res.Counts.NotAvail || 0);
          this.vacantCount.set(res.Counts.Vacant || 0);
        } else {
          this.tableData.set([]);
        }
      },
      error: (err) => {
        console.error('Error fetching grid data:', err);
        this.tableData.set([]);
      }
    });
  }

  async onStatusChange(vehicleData: any) {
    try {
      // Load MPC/MCC options from API
      const indentPayload = createFormData(this.token, {
        GroupId: localStorage.getItem('GroupId') || '',
        ForApp: 0,
      });

      const plantSuppliers = await firstValueFrom(
        this.loadPlanningService.getCreateIndentMaster(indentPayload)
      );

      // Extract MPC/MCC options
      let mpcMccOptions: any[] = [];
      if (
        plantSuppliers?.Status === 'success' &&
        plantSuppliers?.PlantSupplier
      ) {
        mpcMccOptions = plantSuppliers.PlantSupplier.filter(
          (item: any) => item.type === 4 || item.type === 6
        ).map((item: any) => ({
          id: item.id,
          name: `${item.displayName} - ${item.type === 4 ? 'MCC' : 'Supplier'}`,
        }));
      }

      // Reset fields to default
      this.statusModalFieldsSignal.set([...statusModalFields]);

      // Store vehicle data for use in form submission
      this.selectedStatusData.set(vehicleData);

      // Open modal with form
      this.modalService.openForm({
        title: 'Change Vehicle Status',
        fields: this.statusModalFieldsSignal,
        mode: 'form',
        buttonName: 'Update',
        onFieldChange: (event: any) => {
          if (event.controlName === 'currentStatus') {
            if (event.value?.id === 'ASSIGNED') {
              // Add assigned field dynamically with fetched options
              const assigned = { ...assignedField, options: mpcMccOptions };
              this.statusModalFieldsSignal.set([...statusModalFields, assigned]);
            } else {
              // Remove assigned field if another status is selected
              this.statusModalFieldsSignal.set([...statusModalFields]);
            }
          }
        },
        onSave: async (formData: any) => {
          await this.handleStatusFormSubmit(formData, vehicleData);
        },
      });
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        'Failed to open status change modal'
      );
    }
  }

  private async handleStatusFormSubmit(formData: any, vehicleData: any) {
    try {
      // Build payload for status update
      const payload = createFormData(this.token, {
        ForWeb: 1,
        VehNum: vehicleData?.VehicleNum || '',
        MarkVeh: formData?.currentStatus?.id || formData?.currentStatus || '',
        AssignId: formData?.assigned?.id || formData?.assigned || '',
        CurStatus: vehicleData?.CurrentStatus || '',
      });

      const response: any = await firstValueFrom(
        this.loadPlanningService.rmMarkVehicle(payload)
      );

      handleApiResponse(
        response,
        this.toastService,
        () => this.onFormSubmit({}),
        undefined,
        'Vehicle status updated successfully'
      );
    } catch (error: any) {
      handleApiError(error, this.toastService, 'Failed to update vehicle status');
    }
  }
}
