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
  lockstatuscolumn,
  alertDetailColumns,
  regularLocationColumns,
  lockUnlockLocationColumns,
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
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { MapLoader } from './state-service/map.loader';
import { DashboardTilesComponent } from '../../../shared/components/dashboard-tiles/dashboard-tiles.component';
import { NgxSpinnerService } from 'ngx-spinner';

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
    DashboardTilesComponent,
  ],
  templateUrl: './trip-dashboard.component.html',
  styleUrl: './trip-dashboard.component.scss',
})
export class TripDashboardComponent {
  router = inject(Router);
  selectedRowData = signal<any>(null);
  private mapLoader = inject(MapLoader);
  // filterfields = signal<FieldConfig[]>(TripDashbordFilterFields);
  private tripservice = inject(TripService);
  private modalService = inject(UniversalModalService);
  private spinner = inject(NgxSpinnerService);
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
  tiles = signal<any[]>([]);

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
  modal: any;

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
          ? [...tripDashboardGird]
          : tripDashboardGird,
    }));
  }

  async loadinilialdata() {
    this.spinner.show();
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
        this.tiles.set(res.Tiles);
        console.log('tiles', this.tiles);
      }
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        'An error occurred while loading Trip data',
      );
    } finally {
      this.spinner.hide();
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
    this.mapLoader.openMapCallApi(event);
    // const marker = {
    //   position: {
    //     lat: event.lat,
    //     lng: event.lng,
    //   },
    //   title: event.vehicleNo,
    //   markerType: 'tracking',
    //   params: event,
    // };

    // this.modalService.openSimpleMapModal({
    //   center: marker.position,
    //   zoom: 14,
    //   markers: [marker],
    //   title: event.vehicleNo,
    // });
  }

  onKeyClick(data: any, imei: any) {
    console.log('Live Lock Click:', data, imei);
    const currentDate = new Date();
    const formattedCurrentDate =
      currentDate.getFullYear() +
      '-' +
      String(currentDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(currentDate.getDate()).padStart(2, '0') +
      ' ' +
      String(currentDate.getHours()).padStart(2, '0') +
      ':' +
      String(currentDate.getMinutes()).padStart(2, '0') +
      ':' +
      String(currentDate.getSeconds()).padStart(2, '0');

    const toDate = data.closeDate ? data.closeDate : formattedCurrentDate;
    const fromDate = data.DispatchDate || '';
    const result = `${imei}$${data.vehicle_no}`;
    console.log('result', result);

    const payload = createFormData(this.token, {
      from_date: fromDate,
      to_date: toDate,

      vehicle: result,
      otp_for: '',
      status: '',
      angular: '1',
    });

    this.tripservice.elockonclick(payload).subscribe({
      next: (res: any) => {
        console.log('Create Success:', res);
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;
        // const success = handleApiResponse(res, this.toastService);
        // if (success) {
        // }
        const elockdata = res?.Report || [];
        this.modal = this.modalService.openGridModal({
          title: `Elock Data`,
          columns: lockstatuscolumn,
          rowData: elockdata || [],
          size: 'xl',
          // onActionClick: (actionType: string, rowData: any) => {
          //   if (actionType === 'Create_dis') {
          //     this.Create_dis(rowData.IndentId, rowData.TargetDate);
          //   }
          // },
          context: {
            componentParent: this,
          },
        });
      },
      error: (err) => {
        console.error('Create Error:', err);
        handleApiError(err, this.toastService);
      },
    });
    // your logic here
  }

  // alertDatat(data: any, mcc: any, plant: any, supplier: any) {
  //   console.log(data, mcc, plant, supplier);

  //   if (data.length < 0) {
  //     this.toastService.warning('Data Not found');
  //     return;
  //   }
  //   const alertdata = data.map((item: any) => {
  //     return {
  //       ...item,

  //       // ✅ inject new fields
  //       mcc: mcc,
  //       plant: plant,
  //       supplier: supplier,
  //     };
  //   });

  //   console.log('alertdata', alertdata);

  //   // your existing logic
  // }

  alertDatat(data: any, mcc: any, plant: any, supplier: any, key: any) {
    console.log(data, mcc, plant, supplier);

    if (!data || data.length === 0) {
      this.toastService.warning('Data Not found');
      return;
    }

    const alertdata = data.map((item: any) => ({
      ...item,
      mcc: mcc,
      plant: plant,
      supplier: supplier,
    }));

    this.modal = this.modalService.openGridModal({
      title: 'Alert Details',
      columns:
        key == 'S20' || key == 'S30'
          ? [...alertDetailColumns, ...regularLocationColumns]
          : [...alertDetailColumns, ...lockUnlockLocationColumns], // ✅ from config.ts
      rowData: alertdata,
      size: 'xl',
      context: {
        componentParent: this,
      },
    });
  }

  handleSelectionChange(selected: any) {
    this.selectedRowData.set(selected);
  }
}
