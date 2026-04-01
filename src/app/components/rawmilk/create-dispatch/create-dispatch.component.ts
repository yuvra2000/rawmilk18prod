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
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { DispatchService } from './dispatch.service';
import { masterFormData, VehicleFormData } from './state-service/utils';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
} from './../../../shared/utils/shared-utility.utils';
import { AlertService } from './../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { MainDetailsComponent } from './main-details/main-details.component';
import { ChamberDetailsComponent } from './chamber-details/chamber-details.component';
import { MccSelectionComponent } from './mcc-selection/mcc-selection.component';
import { MccChambersComponent } from './mcc-chambers/mcc-chambers.component';
import { DispatchStore } from './state-service/masterdatastore.service';
// interface Transporter {
//   TransporterId: number;
//   TransporterName: string;
//   TransporterCode: string;
//   TransporterMobileNo: string | null;
// }

// interface Vehicle {
//   VehicleId: number;
//   VehicleNo: string;
//   BlacklistStatus: any;
//   Transporter: Transporter[];
// }
// interface DispatchState {
//   milkList: any[];
//   plantList: any[];
//   vehicleOptions: Vehicle[];
//   transporterOptions: any[];
//   loading: boolean;
// }
@Component({
  selector: 'app-create-dispatch',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MainDetailsComponent,
    ChamberDetailsComponent,
    MccSelectionComponent,
    MccChambersComponent,
  ],
  templateUrl: './create-dispatch.component.html',
  styleUrl: './create-dispatch.component.scss',
})
export class CreateDispatchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private masterservice = inject(DispatchService);
  private toastService = inject(AlertService);
  private dispatchStore = inject(DispatchStore);
  form: FormGroup = this.fb.group({
    indent: [''],
    Lr_nu: ['', Validators.required],
    plant: ['', Validators.required],
    MCC: [''],
    vehicle: ['', Validators.required],
    DriverName: [''],
    Driver_no: [''],
    dispatchDate: ['', Validators.required],
    transporter: [''],
    remarks: [''],
    rows: this.fb.array([]),
    noOfMcc: [null],
    mccs: this.fb.array([]),
  });
  // state = signal<DispatchState>({
  //   milkList: [],
  //   plantList: [],
  //   vehicleOptions: [],
  //   transporterOptions: [],
  //   loading: false,
  // });
  ngOnInit() {
    // Subscribe to mccs changes to debug
    this.mccs.valueChanges.subscribe((val) => {
      console.log('MCCs Updated:', this.mccs.controls.length, this.mccs.value);
    });
    // this.loadinitialData();
    this.dispatchStore.loadInitialData(masterFormData, VehicleFormData);
  }

  // async loadinitialData() {
  //   this.state.update((s) => ({ ...s, loading: true }));

  //   forkJoin({
  //     masterData:
  //       this.masterservice.getCreateIndentDataMilkAndPlantSupplier(
  //         masterFormData,
  //       ),
  //     vehicledata: this.masterservice.getVehicleData(VehicleFormData),
  //   })
  //     .pipe(
  //       catchError((error) => {
  //         handleApiError(
  //           error,
  //           this.toastService,
  //           'An error occurred while loading indent data',
  //         );

  //         return of({
  //           masterData: { Milk: [], PlantSupplier: [] },
  //           vehicledata: { Data: [], TransporterList: [] },
  //         });
  //       }),
  //     )
  //     .subscribe((result: any) => {
  //       // 👉 process data FIRST
  //       const vehicleOptions = (result?.vehicledata?.Data || []).filter(
  //         (item: Vehicle) => item.BlacklistStatus !== 1,
  //       );

  //       const transporterOptions = result?.vehicledata?.TransporterList || [];

  //       const filteredPlantList =
  //         result?.masterData?.PlantSupplier?.filter(
  //           (plant: any) => plant.type === 3,
  //         ) || [];

  //       const milkList = result?.masterData?.Milk || [];

  //       // ✅ SINGLE UPDATE (IMPORTANT)
  //       this.state.set({
  //         milkList,
  //         plantList: filteredPlantList,
  //         vehicleOptions,
  //         transporterOptions,
  //         loading: false,
  //       });

  //       console.log('STATE ✅', this.state());
  //     });
  // }

  // 👉 getters
  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get mccs(): FormArray {
    return this.form.get('mccs') as FormArray;
  }

  onSubmit() {
    console.log('Form Value:', this.form.value);
  }
}
