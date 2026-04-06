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
  editFields,
  viewDispatchColumns,
  TripDashbordFilterFields,
  viewIndentSupplierGridColumns,
  viewIndentSupplierGridColumnsDetailed,
  viewIndentSupplierGridColumnsIfNotChillingPlant,
  viewNoOfDispatchColumns,
} from './state-service/config';
import { AlertService } from '../../../shared/services/alert.service';
import { DispatchStore } from '../create-dispatch/state-service/masterdatastore.service';
import {
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
@Component({
  selector: 'app-trip-dashboard',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
  ],
  templateUrl: './trip-dashboard.component.html',
  styleUrl: './trip-dashboard.component.scss',
})
export class TripDashboardComponent {
  router = inject(Router);
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

  private toastService = inject(AlertService);
  private dispatchStore = inject(DispatchStore);
  store = this.dispatchStore.state;
  ngOnInit() {
    this.dispatchStore.loadInitialData(
      masterFormData,
      VehicleFormData,
      mccformdata,
    );
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

    this.filtertripdash(formadat);

    console.log('event', event);
  }

  filtertripdash(payloads: any) {
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
}
