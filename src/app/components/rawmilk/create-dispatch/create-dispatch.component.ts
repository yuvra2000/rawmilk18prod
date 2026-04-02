import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainDetailsComponent } from './main-details/main-details.component';
import { ChamberDetailsComponent } from './chamber-details/chamber-details.component';
import { MccSelectionComponent } from './mcc-selection/mcc-selection.component';
import { MccChambersComponent } from './mcc-chambers/mcc-chambers.component';

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

  ngOnInit() {
    // Subscribe to mccs changes to debug
    this.mccs.valueChanges.subscribe((val) => {
      console.log('MCCs Updated:', this.mccs.controls.length, this.mccs.value);
    });
  }

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
