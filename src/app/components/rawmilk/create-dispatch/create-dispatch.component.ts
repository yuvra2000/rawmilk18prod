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
  Signal,
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
import {
  createFormData,
  handleApiError,
  handleApiResponse,
  handleSessionExpiry,
} from './../../../shared/utils/shared-utility.utils';
import { AlertService } from './../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { MainDetailsComponent } from './main-details/main-details.component';
import { ChamberDetailsComponent } from './chamber-details/chamber-details.component';
import { MccSelectionComponent } from './mcc-selection/mcc-selection.component';
import { MccChambersComponent } from './mcc-chambers/mcc-chambers.component';
import { DispatchStore } from './state-service/masterdatastore.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DispatchPayloadBuilder } from './state-service/dispatch-payload.utils';

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
  prefetchdata = signal<any>({});
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

  structureData = signal<any>(null);
  pagename: any = '';
  isdirectdispatch = signal<boolean>(false);

  async ngOnInit() {
    // Subscribe to mccs changes to debug

    this.dispatchStore.loadInitialData(
      masterFormData,
      VehicleFormData,
      mccformdata,
    );
    // this.structureData().set(history.state?.structuredata);
    this.structureData.set(history.state?.structuredata);

    console.log(this.structureData);

    if ((this.structureData().status = 'Create')) {
      this.pagename = 'Create Dispatch';
    } else if ((this.structureData().status = 'Edit')) {
      this.pagename = 'Edit Dispatch';
    }
    // this.isdirectdispatch()=(this.structureData.DirectDispatch)
    this.isdirectdispatch.set(this.structureData()?.DirectDispatch ?? false);
    if (!this.isdirectdispatch()) {
      // debugger;
      await this.loadPrefetchData();
    }

    // this.rows.setValidators([
    //   QuantityValidators.totalNotExceed(() =>
    //     this.isdirectdispatch()
    //       ? Infinity
    //       : this.prefetchdata().Data?.[0].quantity,
    //   ),
    //   QuantityValidators.mccNotExceedParentSignal(this.mccValidationState),
    // ]);
    console.log('direct dis', this.isdirectdispatch());
    this.rows.setValidators([
      QuantityValidators.totalNotExceed(() =>
        this.isdirectdispatch()
          ? 99999
          : this.prefetchdata().Data?.[0].quantity,
      ),
      QuantityValidators.mccNotExceedParentSignal(this.mccValidationState),
    ]);
    // shouldLoadPrefetch(): boolean {

    // this.rows.setValidators([
    //   QuantityValidators.totalNotExceed(
    //     () => this.prefetchdata().Data?.[0].quantity,
    //   ),

    //   QuantityValidators.mccNotExceedParentSignal(this.mccValidationState),
    // ]);

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
  formControlEffect = effect(() => {
    const isEdit = this.isdirectdispatch(); // signal

    const indent = this.form.get('indent');
    const mcc = this.form.get('MCC');

    if (!indent || !mcc) return;

    if (isEdit) {
      indent.disable();
      mcc.disable();
    } else {
      indent.enable();
      mcc.enable();
    }
  });
  // isEditMode = computed(() => {
  //   return !!(this.structureData()?.id && this.structureData()?.target_date);
  // });

  effectRef = effect(() => {
    const plantList = this.dispatchStore.state().plantList;

    if (plantList.length && !this.isPatched) {
      this.isPatched = true;

      console.log('PlantList Loaded ✅');

      // this.patchPrefetchData(this.prefetchdata, true);
      // this.patchRows(this.prefetchdata.Data[0]);
    }
  });

  // shouldLoadPrefetch(): boolean {
  //   return !!(
  //     this.structureData &&
  //     this.structureData().id &&
  //     this.structureData().target_date
  //   );
  // }

  async loadPrefetchData() {
    // if (!this.shouldLoadPrefetch()) return;
    try {
      const formData = DispatchPayloadBuilder.buildDispatchPrefetchPayload(
        this.structureData(),
      );

      const res = await firstValueFrom(
        this.masterservice.getDispatchPrefetch(formData),
      );

      console.log('Prefetch API Response:', res);
      if (handleSessionExpiry(res, this.toastService)) {
        return;
      }
      // ✅ store response
      this.prefetchdata.set(res);

      // ✅ patch form
      this.patchPrefetchData(this.prefetchdata(), true);
      this.patchRows(this.prefetchdata().Data?.[0]);
    } catch (error) {
      handleApiError(error, this.toastService);
    }
  }

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
    console.log('Patching rows with item:', item); // debug
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
    // this.form.get('indent')?.disable();
    // this.form.get('plant')?.disable();
    // this.form.get('MCC')?.disable();
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

  async onSubmit() {
    // ✅ 1. Validation
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning('Please fill all required (*) fields');
      console.log('formvalue', this.form);

      return;
      // return;
    }

    try {
      // ✅ 2. Get form value (IMPORTANT)
      const formValue = this.form.getRawValue();

      // ✅ 3. Build FINAL payload (your complex mapping)
      const formData = DispatchPayloadBuilder.buildFinalDispatchPayload(
        formValue,
        this.prefetchdata(), // API prefetch data
        this.structureData, // router data
      );
      const formDataDirectDispatch =
        DispatchPayloadBuilder.buildFinalDispatchPayload(
          formValue,
          this.prefetchdata(), // API prefetch data
          this.structureData, // router data
        );

      console.log('FINAL FORM DATA', formData);

      // ✅ 4. Decide API (Create / Edit)
      // return;
      if (this.structureData()?.status === 'Create') {
        if (this.isdirectdispatch()) {
          await this.createDirectDispatch(formDataDirectDispatch);
        } else {
          await this.createDispatch(formData);
        }
      } else {
        // this.updateDispatch(formData);
      }
    } catch (error) {
      console.error('Submit Error:', error);
    }
  }

  createDispatch(formData: FormData) {
    this.masterservice.createDispatch(formData).subscribe({
      next: (res: any) => {
        console.log('Create Success:', res);
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;
        handleApiResponse(res, this.toastService);

        // ✅ redirect after success
        // this.router.navigate(['/dispatch-list']);
      },
      error: (err) => {
        console.error('Create Error:', err);
        handleApiError(err, this.toastService);
      },
    });
  }
  createDirectDispatch(formData: FormData) {
    this.masterservice.createDirectDispatch(formData).subscribe({
      next: (res: any) => {
        console.log('Create Success:', res);
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;
        handleApiResponse(res, this.toastService);

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
