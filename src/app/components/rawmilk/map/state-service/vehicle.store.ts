import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HomeService } from '../services/home.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { firstValueFrom } from 'rxjs';
import { VehicleFormData } from './vehicle.utils';
import { handleSessionExpiry } from '../../../../shared/utils/shared-utility.utils';


// =======================================
// 🚗 VEHICLE STORE (UNCHANGED CORE LOGIC)
// =======================================
@Injectable({ providedIn: 'root' })
export class VehicleStore {

  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private service = inject(HomeService);
  private alertService = inject(AlertService);

  private vehicles = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<any>(null);

  vehicles$ = computed(() => this.vehicles());
  loading$ = computed(() => this.loading());
  error$ = computed(() => this.error());

  async loadInitialData() {
    try {
      this.spinner.show();
      this.loading.set(true);

      const res: any = await firstValueFrom(
        this.service.vehicleList(VehicleFormData)
      );

      if (handleSessionExpiry(res, this.toast)) {
        this.loading.set(false);
        return;
      }

      const vehicleData = Object.entries(res.VehicleList || {}).map(
        ([key, value]) => ({
          ...(value as any),
          VehicleNo: key
        })
      );

      this.vehicles.set(vehicleData);

      console.log('Final Vehicle Data:', vehicleData);

    } catch (error: any) {
      this.toast.error(error?.error?.message || 'Something went wrong');
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
  }

  // ================= FILTER =================
  private filter = signal<string>('All');

  filteredVehicles$ = computed(() => {
    const vehicles = this.vehicles();
    const filter = this.filter();

    if (filter === 'All') return vehicles;

    return vehicles.filter(v => v.VehicleStatus === filter);
  });

  // ================= STATUS COUNT =================
  statusCount$ = computed(() => {
    const vehicles = this.vehicles();

    const count = {
      active: 0,
      inactive: 0,
      noGps: 0,
      noData: 0,
      breakdown: 0,
      all: vehicles.length
    };

    vehicles.forEach(v => {
      switch (v.VehicleStatus) {
        case 'Active': count.active++; break;
        case 'InActive': count.inactive++; break;
        case 'NoData': count.noData++; break;
        case 'NoGPS': count.noGps++; break;
        case 'Breakdown': count.breakdown++; break;
      }
    });

    return count;
  });

  setFilter(status: string) {
    this.filter.set(status);
  }
}


// =======================================
// 📍 LANDMARK STORE
// =======================================
@Injectable({ providedIn: 'root' })
export class LandmarkStore {

  private service = inject(HomeService);
  private toast = inject(ToastrService);

  private landmarks = signal<any[]>([]);
  private loading = signal(false);

  landmarks$ = computed(() => this.landmarks());
  loading$ = computed(() => this.loading());

  async loadLandmarks() {
    try {
      this.loading.set(true);

      const formData = new FormData();
      formData.append('AccessToken', localStorage.getItem('AccessToken')!);

      const res: any = await firstValueFrom(
        this.service.landmarkList(formData)
      );

      if (handleSessionExpiry(res, this.toast)) {
        this.loading.set(false);
        return;
      }

      const landmarkData = res?.LandmarkList || [];
      this.landmarks.set(landmarkData);

      console.log('Landmarks:', landmarkData);

    } catch (err: any) {
      this.toast.error(err?.message || 'Landmark load failed');
    } finally {
      this.loading.set(false);
    }
  }
}


// =======================================
// 🛑 GEOFENCE STORE
// =======================================
@Injectable({ providedIn: 'root' })
export class GeofenceStore {

  private service = inject(HomeService);
  private toast = inject(ToastrService);

  private geofences = signal<any[]>([]);
  private loading = signal(false);

  geofences$ = computed(() => this.geofences());
  loading$ = computed(() => this.loading());

  async loadGeofences() {
    try {
      this.loading.set(true);

      const formData = new FormData();
      formData.append('AccessToken', localStorage.getItem('AccessToken')!);

      const res: any = await firstValueFrom(
        this.service.geofence_list(formData)
      );

      if (handleSessionExpiry(res, this.toast)) {
        this.loading.set(false);
        return;
      }

      const geofenceData = res?.GeofenceList || [];
      this.geofences.set(geofenceData);

      console.log('Geofences:', geofenceData);

    } catch (err: any) {
      this.toast.error(err?.message || 'Geofence load failed');
    } finally {
      this.loading.set(false);
    }
  }
}