import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-mcc-selection',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule],
  templateUrl: './mcc-selection.component.html',
})
export class MccSelectionComponent implements OnInit {
  @Input() form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Subscribe to noOfMcc changes
    this.form.get('noOfMcc')?.valueChanges.subscribe((count) => {
      console.log('MCC Selected from dropdown:', count);
      this.updateMccs(count);
    });
  }

  // 👉 getter
  get mccs(): FormArray {
    return this.form.get('mccs') as FormArray;
  }

  // 👉 options
  mccOptions = [
    { label: 'No.Of mcc', value: null },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
  ];

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

  // 👉 update MCCs
  updateMccs(count: number) {
    console.log('updateMccs called with count:', count);
    this.mccs.clear();

    if (!count) {
      console.log('No count provided');
      return;
    }

    for (let i = 0; i < count; i++) {
      this.mccs.push(this.createMcc());
    }

    console.log('MCCs created. Length:', this.mccs.controls.length);
    console.log('MCC ARRAY:', this.mccs.value);
  }

  // 👉 on select (for change event)
  onMccChange(count: number) {
    console.log('onMccChange called with:', count);
    this.updateMccs(count);
  }
}
