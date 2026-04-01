import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DispatchStore } from '../state-service/masterdatastore.service';

@Component({
  selector: 'app-mcc-chambers',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, CommonModule],
  templateUrl: './mcc-chambers.component.html',
  styleUrl: './mcc-chambers.component.scss',
})
export class MccChambersComponent {
  @Input() mccs!: FormArray;
  public store = inject(DispatchStore);
  constructor(private fb: FormBuilder) {}

  // 👉 create chamber
  createChamber(): FormGroup {
    return this.fb.group({
      chamber_no: [''],
      milkType: [''],
      temperature: [''],
      quantity: [''],
      fat: [''],
      snf: [''],
      mbrt: [''],
    });
  }

  // 👉 create MCC
  createMcc(): FormGroup {
    return this.fb.group({
      mccSelect: [''],
      chambers: this.fb.array([this.createChamber()]),
    });
  }

  // 👉 add/remove chambers
  addChamber(i: number) {
    this.getChambers(i).push(this.createChamber());
  }

  removeChamber(i: number) {
    const chambers = this.getChambers(i);
    if (chambers.length > 1) {
      chambers.removeAt(chambers.length - 1);
    }
  }

  // 👉 remove MCC
  removeMcc(i: number) {
    this.mccs.removeAt(i);
  }

  // 👉 helpers
  asFormGroup(ctrl: any): FormGroup {
    return ctrl as FormGroup;
  }

  getChambers(i: number): FormArray {
    return this.mccs.at(i).get('chambers') as FormArray;
  }

  // 👉 trackBy function
  trackByIndex(index: number): number {
    return index;
  }
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.mccs.at(index).patchValue({ file });
  }
}
