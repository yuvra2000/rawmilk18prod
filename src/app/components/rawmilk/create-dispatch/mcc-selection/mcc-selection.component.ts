import { Component, Input, OnInit, computed, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DispatchStore } from '../state-service/masterdatastore.service';

@Component({
  selector: 'app-mcc-selection',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule],
  templateUrl: './mcc-selection.component.html',
  styleUrl: './mcc-selection.component.scss',
})
export class MccSelectionComponent implements OnInit {
  @Input() form!: FormGroup;
  public store = inject(DispatchStore);
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

  mccOptions = computed(() => {
    const length = this.store.state().mcclist.length;

    const options: { label: string; value: number | null }[] = [
      { label: 'No.Of mcc', value: null },
    ];

    for (let i = 1; i <= length; i++) {
      options.push({ label: i.toString(), value: i });
    }

    return options;
  });
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
