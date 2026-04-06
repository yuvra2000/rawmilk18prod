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
import {
  masterFormData,
  mccformdata,
  QuantityValidators,
  VehicleFormData,
} from './state-service/utils';
import { AlertService } from './../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { MainDetailsComponent } from './main-details/main-details.component';
import { ChamberDetailsComponent } from './chamber-details/chamber-details.component';
import { MccSelectionComponent } from './mcc-selection/mcc-selection.component';
import { MccChambersComponent } from './mcc-chambers/mcc-chambers.component';
import { DispatchStore } from './state-service/masterdatastore.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

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
    MCC: ['', Validators.required],
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
  isPatched = false;
  isEdit = true;
  prefetchdata = {
    Data: [
      {
        _id: {
          $oid: '69cbb8168f086d26cf0a44f3',
        },
        indent_no: 'I1000358068',
        target_date: '2026-04-02',
        plant_id: '70',
        plant_code: '1488',
        plant_name: 'Sharda Mines,Haryana  ',
        quantity: 6010,
        milk_id: '10',
        milk_type: '66000502',
        milk_type_name: 'Cow Raw Milk',
        supplier_id: '1',
        supplier_code: '4024107',
        supplier_name: 'NDS-Paayas MPC',
        mcc_id: '23',
        mcc_code: '20308',
        mcc_name: 'Jaitpura Paayas Milk Pro.',
        sub_indent: 0,
        fat: '',
        snf: '',
        mbrt: '',
        m_parent_indent_id: {
          $oid: '69c107e0a9a7a20c160ca1a4',
        },
        group_id: '5731',
        create_id: 182476,
        create_date: '2026-03-31',
        edit_id: '',
        edit_date: '',
        status: 3,
        remark: 'App',
        request_ip: '172.31.7.139',
        rem_qty: 6010,
      },
    ],
  };
  rowsSignal = toSignal(this.rows.valueChanges, {
    initialValue: this.rows.value,
  });

  mccsSignal = toSignal(this.mccs.valueChanges, {
    initialValue: this.mccs.value,
  });
  mccValidationState = QuantityValidators.buildMccValidationState(
    this.rowsSignal,
    this.mccsSignal,
  );
  // targetDate = signal<string>('');
  private router = inject(Router);

  structureData: any;

  ngOnInit() {
    // Subscribe to mccs changes to debug

    this.structureData = history.state?.structuredata;

    console.log(this.structureData);

    this.dispatchStore.loadInitialData(
      masterFormData,
      VehicleFormData,
      mccformdata,
    );

    this.rows.setValidators([
      QuantityValidators.totalNotExceed(
        () => this.prefetchdata.Data[0].quantity,
      ),

      QuantityValidators.mccNotExceedParentSignal(this.mccValidationState),
    ]);

    // effect(() => {
    //   const plantList = this.dispatchStore.state().plantList;

    //   if (plantList.length && !this.isPatched) {
    //     this.isPatched = true;

    //     this.patchPrefetchData(prefetchdata, true);
    //   }
    // });

    //

    // this.patchPrefetchData(prefetchdata, isEdit);
    // this.mccs.valueChanges.subscribe((val) => {
    //   console.log('MCCs Updated:', this.mccs.controls.length, this.mccs.value);
    // });
    // this.loadinitialData();
    // this.rows.setValidators([
    //   QuantityValidators.totalNotExceed(
    //     () => this.prefetchdata.Data[0].quantity,
    //   ),

    //   // ✅ NEW MCC validation
    //   QuantityValidators.mccNotExceedParent(
    //     () => this.rows,
    //     () => this.mccs,
    //   ),
    // ]);

    // // 🔥 trigger validation when MCC changes
    // this.mccs.valueChanges.subscribe(() => {
    //   this.rows.updateValueAndValidity();
    // });
    // this.rows.setValidators(
    //   QuantityValidators.childNotExceedParent(
    //     () => this.rows,
    //     () => this.mccs,
    //   ),
    // );

    // 🔥 VERY IMPORTANT (trigger validation)
    // this.mccs.valueChanges.subscribe(() => {
    //   this.rows.updateValueAndValidity();
    // });

    // this.rows.valueChanges.subscribe(() => {
    //   this.rows.updateValueAndValidity();
    // });
  }

  effectRef = effect(() => {
    const plantList = this.dispatchStore.state().plantList;

    if (plantList.length && !this.isPatched) {
      this.isPatched = true;

      console.log('PlantList Loaded ✅');

      this.patchPrefetchData(this.prefetchdata, true);
      this.patchRows(this.prefetchdata.Data[0]);
    }
  });

  patchPrefetchData(data: any, isEdit: boolean) {
    const item = data?.Data?.[0];
    if (!item) return;

    const state = this.dispatchStore.state();
    console.log('count abd state', state.milkList, item);
    const selectedMcc = state.mcclist.find((x) => x.mcc_id == item.mcc_id);

    this.form.patchValue({
      indent: item.indent_no,
      plant: item.plant_name,
      MCC: selectedMcc,
      dispatchDate: item.target_date,
    });

    console.log('Selected milk:', selectedMcc); // debug
    this.disableMainFields();
  }

  patchRows(item: any) {
    // this.rows.clear();
    const state = this.dispatchStore.state();
    const selectedmilk = state.milkList.find(
      (x) => x.id == Number(item.milk_id),
    );
    this.rows.patchValue([
      {
        milkType: selectedmilk,
        quantity: item.quantity,
      },
    ]);
    // this.rows.push(

    //   this.fb.group({
    //     milkType: [selectedmilk, Validators.required],
    //     quantity: [item.quantity, [Validators.required, Validators.min(1)]],
    //   }),
    // );
    this.disableFirstRowMilkType();
  }

  disableMainFields() {
    this.form.get('indent')?.disable();
    this.form.get('plant')?.disable();
    this.form.get('MCC')?.disable();
  }
  disableFirstRowMilkType() {
    if (this.rows.length > 0) {
      const firstRow = this.rows.at(0) as FormGroup;

      firstRow.get('milkType')?.disable(); // ✅ only index 0
    }
  }

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
