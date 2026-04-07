import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from "../../../shared/components/collapse-wrapper/collapse-wrapper.component";
import { FieldConfig, FilterFormComponent } from "../../../shared/components/filter-form/filter-form.component";
import { filterFields, loadPlanningColumns } from './state-service/config';
import { LoadPlanningService } from './load-planning.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AdvancedGridComponent, GridConfig } from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { TileComponent } from '../../../shared/components/tile/tile.component';

@Component({
  selector: 'app-load-planning',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent, AdvancedGridComponent, TileComponent],
  templateUrl: './load-planning.component.html',
  styleUrl: './load-planning.component.scss'
})
export class LoadPlanningComponent implements OnInit {

  assignedCount = signal<number>(0);
  breakDownCount = signal<number>(0)
  loadedCount = signal<number>(0)
  notAvailCount = signal<number>(0)
  vacantCount = signal<number>(0)
  vehicleList = signal<any[]>([]);
  transporterList = signal<any[]>([]);
  dispatchLocationList = signal<any[]>([]);
  destinationList = signal<any[]>([]);

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
    columns: loadPlanningColumns,
  });

  tableData = signal<any[]>([]);

  constructor(private loadPlanningService: LoadPlanningService) {}

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
}
