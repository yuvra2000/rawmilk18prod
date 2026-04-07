import {
  Input,
  Component,
  signal,
  OnInit,
  inject,
  viewChild,
  ViewChild,
  computed,
  effect,
  input,
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
  targetDateSignal = signal<string>('');
  isEditMode = input<boolean>();
  // ✅ Input (same name जो HTML में है)
  @Input()
  set targetDate(value: any) {
    if (value) {
      this.targetDateSignal.set(value);
      // this.applyDateLogic();
    }
  }
  // @Input() state!: any;
  private masterservice = inject(DispatchService);
  private toastService = inject(AlertService);
  public store = inject(DispatchStore);
  minDate = signal<string>('');
  maxDate = signal<string>('');
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

  constructor() {
    effect(
      () => {
        const date = this.targetDateSignal();
        // const user = this.userTypeSignal();

        if (!date) return;

        // if (user === 1) {
        this.setDateRange1(date);
        // } else {
        // this.setDateRange(date);
        // }
      },
      { allowSignalWrites: true }, // ⭐ IMPORTANT
    );
  }

  // constructor() {
  //   console.log(
  //     'MainDetailsComponent initialized with targetDate:',
  //     this.targetDateSignal(),
  //   );
  //   effect(() => {
  //     const date = this.targetDateSignal();

  //     if (date) {
  //       debugger;
  //       this.setDateRange(date);
  //     }
  //   });
  // }
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

  // 🔵 USER 1 (LIVE USER)
  setDateRange1(targetDateStr: string): void {
    const targetDate = new Date(targetDateStr + 'T23:59:59');

    const now = new Date();
    now.setSeconds(0, 0);

    const min = new Date(now);
    min.setHours(min.getHours() - 1); // ⏪ 1 hour back

    const max = new Date(now);
    max.setMinutes(now.getMinutes() + 5); // ⏩ +5 min

    const finalMax = max > targetDate ? targetDate : max;

    this.minDate.set(this.formatDateTime(min));
    this.maxDate.set(this.formatDateTime(finalMax));

    this.form.patchValue({
      dispatchDate: this.formatDateTime(now),
    });

    console.log('USER 1 RANGE', this.minDate(), this.maxDate());
  }

  // 🟢 USER 2 (BACKDATE USER)
  setDateRange(targetDateStr: string): void {
    const targetDate = new Date(targetDateStr + 'T23:59:59');

    const min = new Date(targetDateStr + 'T00:00:00');
    min.setDate(min.getDate() - 2); // ⏪ 2 days back

    const now = new Date();
    now.setSeconds(0, 0);

    const max = new Date(now);
    max.setMinutes(now.getMinutes() + 5);

    const finalMax = max > targetDate ? targetDate : max;

    this.minDate.set(this.formatDateTime(min));
    this.maxDate.set(this.formatDateTime(finalMax));

    this.form.patchValue({
      dispatchDate: this.formatDateTime(now),
    });

    console.log('USER 2 RANGE', this.minDate(), this.maxDate());
  }

  // ✅ FORMAT
  formatDateTime(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(
      2,
      '0',
    )}T${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}`;
  }
}
