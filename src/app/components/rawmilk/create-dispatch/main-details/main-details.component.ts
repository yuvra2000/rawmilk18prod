import {
  Input,
  Component,
  signal,
  OnInit,
  inject,
  viewChild,
  ViewChild,
  computed,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { DispatchService } from '../dispatch.service';
import { masterFormData, VehicleFormData } from '../state-service/utils';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
} from '../../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { DispatchStore } from '../state-service/masterdatastore.service';

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
// state = signal<DispatchState>({
//   milkList: [],
//   plantList: [],
//   vehicleOptions: [],
//   transporterOptions: [],
//   loading: false,
// });
@Component({
  selector: 'app-main-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './main-details.component.html',
  styleUrl: './main-details.component.scss',
})
export class MainDetailsComponent implements OnInit {
  @Input() form!: FormGroup;
  // @Input() state!: any;
  private masterservice = inject(DispatchService);
  private toastService = inject(AlertService);
  public store = inject(DispatchStore);
  // state = signal({
  //   milkList: [],
  //   plantList: [],
  //   vehicleOptions: [] as Vehicle[],
  //   transporterOptions: [],
  //   selectedVehicleTransporters: [] as Transporter[],
  // });

  ngOnInit() {
    // this.loadinitialData();
  }

  // async loadinitialData() {
  //   try {
  //     forkJoin({
  //       masterData:
  //         this.masterservice.getCreateIndentDataMilkAndPlantSupplier(
  //           masterFormData,
  //         ),
  //       vehicledata: this.masterservice.getVehicleData(VehicleFormData),
  //     })
  //       .pipe(
  //         catchError((error) => {
  //           handleApiError(
  //             error,
  //             this.toastService,
  //             'An error occurred while loading indent data',
  //           );
  //           return of({
  //             masterData: { Milk: [], PlantSupplier: [] },
  //             vehicledata: { Data: [], TransporterList: [] },
  //           });
  //         }),
  //       )
  //       .subscribe((result: any) => {
  //         const vehicleOptions = (result?.vehicledata?.Data || []).filter(
  //           (item: Vehicle) => item.BlacklistStatus !== 1,
  //         );
  //         const transporterOptions = result?.vehicledata?.TransporterList || [];
  //         this.state.update((state) => ({
  //           ...state,
  //           vehicleOptions: vehicleOptions,
  //           transporterOptions: transporterOptions,
  //         }));
  //         console.log('Vehicle Options:', this.state().vehicleOptions);
  //         console.log('Transporter Options:', this.state().transporterOptions);

  //         const filteredPlantList =
  //           result?.masterData?.PlantSupplier?.filter(
  //             (plant: any) => plant.type === 3,
  //           ) || [];

  //         this.state.update((state) => ({
  //           ...state,
  //           milkList: result?.masterData?.Milk || [],
  //           plantList: filteredPlantList,
  //         }));
  //         console.log('Milk List:', this.state().milkList);
  //         console.log('Plant List:', this.state().plantList);
  //       });
  //   } catch (error: any) {
  //     handleApiError(
  //       error,
  //       this.toastService,
  //       'An error occurred while loading indent data',
  //     );
  //   }
  // }

  onVehicleChange(vehicle: Vehicle) {
    console.log('Selected Vehicle:', vehicle);

    // if (vehicle && vehicle.VehicleId) {
    //   this.store.state.update((state) => ({
    //     ...state,
    //     selectedVehicleTransporters: vehicle.Transporter || [],
    //   }));
    //   console.log(
    //     'Selected Vehicle Transporters:',
    //     this.store.state().selectedVehicleTransporters,
    //   );
    //   // this.form.patchValue({ transporter: null });
    // }
    this.store.setSelectedVehicle(vehicle);
  }
}
