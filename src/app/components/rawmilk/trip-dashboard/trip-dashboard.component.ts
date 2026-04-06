import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import {
  actionColumn,
  TripDashbordFilterFields,
  tripDashboardGird,
} from './state-service/config';
import { AlertService } from '../../../shared/services/alert.service';
import { DispatchStore } from '../create-dispatch/state-service/masterdatastore.service';
import {
  formData,
  masterFormData,
  mccformdata,
  VehicleFormData,
} from './state-service/utils';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
  handleSessionExpiry,
} from '../../../shared/utils/shared-utility.utils';
import { TripService } from './state-service/trip.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-trip-dashboard',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    NgbModule,
    AdvancedGridComponent,
  ],
  templateUrl: './trip-dashboard.component.html',
  styleUrl: './trip-dashboard.component.scss',
})
export class TripDashboardComponent {
  router = inject(Router);
  selectedRowData = signal<any>(null);
  // filterfields = signal<FieldConfig[]>(TripDashbordFilterFields);
  private tripservice = inject(TripService);
  filterfields = computed<FieldConfig[]>(() => {
    const state = this.store();
    console.log('state', state);

    return TripDashbordFilterFields.map((field) => {
      if (field.name === 'vehicle') {
        return {
          ...field,
          options: state.vehicleOptions || [],
        };
      }
      if (field.name === 'supplier') {
        return {
          ...field,
          options: state.supplier || [],
        };
      }
      if (field.name === 'Plant') {
        return {
          ...field,
          options: state.plantList || [],
        };
      }
      if (field.name === 'transporter') {
        return {
          ...field,
          options: state.transporterOptions || [],
        };
      }

      if (field.name === 'mcc') {
        return {
          ...field,
          options: state.mcclist || [],
        };
      }

      return field;
    });
  });
  usertype = signal<any>('');
  TripRowData = signal<any[]>([]);

  tripConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelectionMode: 'single',
    enableRowSelection: true,
    isRowSelectable: (params: any) => {
      const usertype = this.usertype();

      return (
        usertype !== 'Manager' &&
        usertype !== '' &&
        params.data?.dispatchStatus !== 'Closed'
      );
    },
    // isRowSelectable: (params: any) => {
    //   return params?.closeStatus == 1 && this.usertype() === 'Manager';
    // },
    context: {
      componentParent: this,
    },
    columns: [],
  });
  token = localStorage.getItem('AccessToken') || '';
  private toastService = inject(AlertService);
  private dispatchStore = inject(DispatchStore);
  store = this.dispatchStore.state;

  ngOnInit() {
    this.token = localStorage.getItem('AccessToken') || '';
    this.usertype.set(localStorage.getItem('usertype') || '');
    console.log('User Type:', this.usertype());
    this.dispatchStore.loadInitialData(
      masterFormData,
      VehicleFormData,
      mccformdata,
    );
    this.setupGrid();
    this.loadinilialdata();
  }

  setupGrid() {
    this.tripConfig.update((config) => ({
      ...config,
      columns:
        this.usertype() === 'Manager' || this.usertype() == '12'
          ? [...tripDashboardGird, actionColumn]
          : tripDashboardGird,
    }));
  }

  async loadinilialdata() {
    try {
      const res: any = await firstValueFrom(
        this.tripservice.tripdata(formData),
      );

      console.log('Response:', res);

      const sessionExp = handleSessionExpiry(res, this.toastService);
      if (sessionExp) return;

      const success = handleApiResponse(res, this.toastService);
      if (success) {
        this.TripRowData.set(res.Data);
      }
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        'An error occurred while loading Trip data',
      );
    }
  }

  directdispatch() {
    // Logic to export data to Excel
    this.router.navigate(['/create-dispatch'], {
      state: {
        structuredata: {
          status: 'Create',
          DirectDispatch: true,
        },
      },
    });
    console.log('');
  }

  onFormSubmit(vlaue: any) {}

  onFilterChange(event: any) {
    this.dispatchStore.state.update((state) => ({
      ...state,
      mcclist: [],
    }));
    const token = localStorage.getItem('AccessToken') || '';
    const formadat = createFormData(token, {
      GroupId: localStorage.getItem('GroupId') || '',
      supplier_id: event.value.id || '',
      ForApp: '0',
    });

    this.mccselection(formadat);

    console.log('event', event);
  }

  mccselection(payloads: any) {
    this.tripservice.getMccData(payloads).subscribe({
      next: (res: any) => {
        console.log('Create Success:', res);
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;
        const success = handleApiResponse(res, this.toastService);
        if (success) {
        }
        const newMccList = res?.Data || [];

        // ✅ UPDATE STORE PROPERLY
        this.dispatchStore.state.update((state) => ({
          ...state,
          mcclist: newMccList,
        }));

        // ✅ redirect after success
        // this.router.navigate(['/dispatch-list']);
      },
      error: (err) => {
        console.error('Create Error:', err);
        handleApiError(err, this.toastService);
      },
    });
  }
  onVehicleClick(event: any) {
    console.log('Event', event);
  }

  onKeyClick(data: any, imei: any) {
    console.log('Live Lock Click:', data, imei);

    // your logic here
  }

  alertDatat(data: any, mcc: any, plant: any, supplier: any) {
    console.log(data, mcc, plant, supplier);

    // your existing logic
  }

  handleSelectionChange(selected: any) {
    this.selectedRowData.set(selected);
  }
}
