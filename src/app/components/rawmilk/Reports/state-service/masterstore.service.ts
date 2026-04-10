import { Injectable, signal, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  handleApiError,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../../shared/services/alert.service';
import { ReportService } from './report.service';

export interface ReportsFilter {
  vehicleOptions: Vehicle[];
  loading: boolean;
}

interface Transporter {
  TransporterId: number;
  TransporterName: string;
  TransporterCode: string;
  TransporterMobileNo: string | null;
}

interface Vehicle {
  VehicleId: string;
  VehicleNo: string;
  BlacklistStatus: number;
  Transporter: Transporter[];
}

@Injectable({ providedIn: 'root' })
export class MasterStore {
  // 🔥 STATE
  state = signal<ReportsFilter>({
    vehicleOptions: [],
    loading: false,
  });

  private toastService = inject(AlertService);
  private reportService = inject(ReportService);

  constructor() {
    console.log('✅ MasterStore initialized');
  }

  // 🔥 LOAD INITIAL DATA
  loadInitialData(vehicleFormData: any) {
    // 👉 set loading true
    this.state.update((s) => ({ ...s, loading: true }));

    forkJoin({
      vehicledata: this.reportService.getvehicle(vehicleFormData),
    })
      .pipe(
        catchError((error) => {
          handleApiError(error, this.toastService, 'Error while loading data');

          return of({
            vehicledata: { VehicleList: {} },
          });
        }),
      )
      .subscribe((result: any) => {
        console.log('API RESULT ✅', result);

        // 👉 session expiry check
        const sessionExpired = handleSessionExpiry(result, this.toastService);
        if (sessionExpired) return;

        // 🔥 OBJECT → ARRAY FIX
        const vehicleListObj = result?.vehicledata?.VehicleList || {};

        const vehicleOptions = Object.values(
          vehicleListObj as Record<string, Vehicle>,
        ).filter((v) => v.BlacklistStatus !== 1);

        // 🔥 SINGLE STATE UPDATE
        this.state.set({
          vehicleOptions,
          loading: false,
        });

        console.log('STATE ✅', this.state());
      });
  }

  // 🔥 OPTIONAL: vehicle selection logic
  // setSelectedVehicle(vehicle: Vehicle) {
  //   this.state.update((state) => ({
  //     ...state,
  //     selectedVehicleTransporters: vehicle?.Transporter || [],
  //   }));
  // }
}
