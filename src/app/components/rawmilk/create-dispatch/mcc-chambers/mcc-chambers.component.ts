import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DispatchStore } from '../state-service/masterdatastore.service';
import { InputValidators } from '../state-service/utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mcc-chambers',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, CommonModule, NgbModule],
  templateUrl: './mcc-chambers.component.html',
  styleUrl: './mcc-chambers.component.scss',
})
export class MccChambersComponent {
  @Input() mccs!: FormArray;
  @Input() rows!: FormArray;
  @Input() form!: FormGroup;

  public store = inject(DispatchStore);
  constructor(private fb: FormBuilder) {}

  // 👉 create chamber
  createChamber(): FormGroup {
    return this.fb.group({
      chamber_no: ['', Validators.required],
      milkType: ['', Validators.required],

      temperature: [
        '',
        [Validators.required, Validators.pattern(/^-?\d{1,2}(\.\d{1,2})?$/)],
      ],

      quantity: ['', [Validators.required, Validators.pattern(/^\d{1,5}$/)]],

      fat: [
        '',
        [Validators.required, Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)],
      ],

      snf: [
        '',
        [Validators.required, Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)],
      ],

      mbrt: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      upload: [''],
    });
  }
  // @Input() rows!: FormArray;

  isMccExceeded(index: number): boolean {
    const parentQty = Number(this.rows.at(index)?.get('quantity')?.value || 0);

    let total = 0;

    this.mccs.controls.forEach((mcc) => {
      const chambers = mcc.get('chambers') as FormArray;
      const ch = chambers?.at(index);

      if (ch) {
        total += Number(ch.get('quantity')?.value || 0);
      }
    });

    return total > parentQty;
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
    this.form.get('noOfMcc')?.setValue(this.mccs.length, {
      emitEvent: false,
    });
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

  preventInvalidChars(event: KeyboardEvent, field: string) {
    InputValidators.preventInvalidChars(event, field);
  }

  sanitizePaste(event: ClipboardEvent) {
    InputValidators.sanitizePaste(event);
  }

  getError(row: any, field: string, error: string) {
    return InputValidators.getError(row, field, error);
  }
}
