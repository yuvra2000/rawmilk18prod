import { Injectable, signal, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DispatchService } from '../dispatch.service';
import { handleApiError } from '../../../../shared/utils/shared-utility.utils';
// import { handleApiError } from '../../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../../shared/services/alert.service';

export interface DispatchState {
  milkList: any[];
  plantList: any[];
  vehicleOptions: Vehicle[];
  transporterOptions: Transporter[];
  selectedVehicleTransporters?: Transporter[];
  mcclist: any[];
  loading: boolean;
}
interface Transporter {
  TransporterId: number;
  TransporterName: string;
  TransporterCode: string;
  TransporterMobileNo: string | null;
}

interface Vehicle {
  VehicleId: number;
  VehicleNo: string;
  BlacklistStatus: any;
  Transporter: Transporter[];
}

@Injectable({ providedIn: 'root' })
export class DispatchStore {
  state = signal<DispatchState>({
    milkList: [],
    plantList: [],
    vehicleOptions: [],
    transporterOptions: [],
    selectedVehicleTransporters: [],
    mcclist: [],
    loading: false,
  });
  userType = localStorage.getItem('usertype') || 'supplier';
  private toastService = inject(AlertService);
  private dispatchService = inject(DispatchService);

  constructor() {
    console.log('DispatchStore initialized with userType:', this.userType);
  }

  loadInitialData(masterFormData: any, vehicleFormData: any, mccformdata: any) {
    this.state.update((s) => ({ ...s, loading: true }));

    forkJoin({
      masterData:
        this.dispatchService.getCreateIndentDataMilkAndPlantSupplier(
          masterFormData,
        ),
      vehicledata: this.dispatchService.getVehicleData(vehicleFormData),

      // 👉 CONDITIONAL MCC API
      mccData:
        this.userType === 'Supplier'
          ? this.dispatchService.getMccData(mccformdata)
          : of(null),
    })
      .pipe(
        catchError((error) => {
          handleApiError(
            error,
            this.toastService,
            'An error occurred while loading indent data',
          );

          return of({
            masterData: { Milk: [], PlantSupplier: [] },
            vehicledata: { Data: [], TransporterList: [] },
            mccData: null,
          });
        }),
      )
      .subscribe((result: any) => {
        // debugger;
        console.log('API RESULT ✅', result);
        // 👉 process data FIRST
        const vehicleOptions = (result?.vehicledata?.Data || []).filter(
          (item: Vehicle) => item.BlacklistStatus !== 1,
        );

        const transporterOptions = result?.vehicledata?.TransporterList || [];

        const filteredPlantList =
          result?.masterData?.PlantSupplier?.filter(
            (plant: any) => plant.type === 3,
          ) || [];
        // const mcc =
        //   result?.masterData?.PlantSupplier?.filter(
        //     (plant: any) => plant.type == 4 && plant.type == '4',
        //   ) || [];

        const milkList = result?.masterData?.Milk || [];
        let mcclist: any[] = [];
        if (this.userType === 'Supplier') {
          mcclist = result?.mccData?.Data || [];
        } else {
          mcclist =
            result?.masterData?.PlantSupplier?.filter(
              (plant: any) => plant.type == 4,
            ) || [];
        }

        // ✅ SINGLE UPDATE (IMPORTANT)
        this.state.set({
          milkList,
          plantList: filteredPlantList,
          vehicleOptions,
          transporterOptions,
          mcclist,
          loading: false,
        });

        console.log('STATE ✅', this.state());
      });
  }

  setSelectedVehicle(vehicle: Vehicle) {
    this.state.update((state) => ({
      ...state,
      selectedVehicleTransporters: vehicle?.Transporter || [],
    }));
  }
}
