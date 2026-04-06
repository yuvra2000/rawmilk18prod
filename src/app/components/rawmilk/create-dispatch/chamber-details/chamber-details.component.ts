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
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { DispatchStore } from '../state-service/masterdatastore.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuantityValidators, InputValidators } from '../state-service/utils';

@Component({
  selector: 'app-chamber-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, NgbModule],
  templateUrl: './chamber-details.component.html',
  styleUrl: './chamber-details.component.scss',
})
export class ChamberDetailsComponent {
  @Input() rows!: FormArray;
  @Input() isEditMode!: boolean;
  public store = inject(DispatchStore);
  // private masterservice = inject(DispatchService);
  // private toastService = inject(AlertService);
  // state = signal({
  //   milkList: [],
  //   plantList: [],
  // });
  @Input() prefetchQuantity!: number;
  maxRows = 3;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // ✅ Ensure at least one row exists
    // if (this.rows.length === 0) {
    this.addRow();
    // this.validateTotalQuantity();
    // }
    // this.loadinitialData();

    // this.rows.setValidators(
    //   QuantityValidators.totalNotExceed(() => this.prefetchQuantity),
    // );

    this.rows.updateValueAndValidity();
  }
  addRow() {
    this.rows.push(this.createRow());
  }

  // ✅ Create Row FormGroup
  createRow(): FormGroup {
    return this.fb.group({
      chamber_no: ['', Validators.required],

      milkType: ['', Validators.required],

      // ✅ Temperature (-99.99 to 99.99)
      temperature: [
        '',
        [Validators.required, Validators.pattern(/^-?\d{1,2}(\.\d{1,2})?$/)],
      ],

      // ✅ Quantity (max 5 digits)
      // quantity: ['', [Validators.required, Validators.pattern(/^\d{1,5}$/)]],
      quantity: ['', [Validators.required, Validators.pattern(/^\d{1,5}$/)]],
      // QuantityValidators.totalNotExceed(() => this.prefetchQuantity),
      // ✅ Fat (e.g. 6.5)
      fat: [
        '',
        [Validators.required, Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)],
      ],

      // ✅ SNF (e.g. 8.5)
      snf: [
        '',
        [Validators.required, Validators.pattern(/^\d{1,2}(\.\d{1,2})?$/)],
      ],

      // ✅ MBRT (max 3 digits)
      mbrt: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],

      upload: [null],
    });
  }

  // ✅ Remove Row
  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  // ✅ File Handler
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.rows.at(index).patchValue({ file });
  }

  getFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  isFieldInvalid(row: any, field: string): boolean {
    const control = this.getFormGroup(row).get(field);
    return !!(control && control.invalid && control.touched);
  }

  // getError(row: any, field: string, error: string): boolean {
  //   const control = this.getFormGroup(row).get(field);
  //   return !!(control && control.hasError(error));
  // }
  // getError(row: any, field: string, error: string): boolean {
  //   const control = this.getFormGroup(row).get(field);
  //   return !!(control && control.hasError(error));
  // }

  // preventInvalidChars(event: KeyboardEvent, field: string): void {
  //   const char = event.key;
  //   const inputElement = event.target as HTMLInputElement;
  //   const currentValue = inputElement.value;

  //   if (
  //     ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)
  //   ) {
  //     return;
  //   }

  //   let regex;
  //   let maxLength = 0;

  //   switch (field) {
  //     case 'temperature':
  //       regex = /^-?\d{0,2}(\.\d{0,2})?$/;
  //       maxLength = 6;
  //       break;

  //     case 'quantity':
  //       regex = /^\d{0,5}$/;
  //       maxLength = 5;
  //       break;

  //     case 'fat':
  //     case 'snf':
  //       regex = /^\d{0,2}(\.\d{0,2})?$/;
  //       maxLength = 5;
  //       break;

  //     case 'mbrt':
  //       regex = /^\d{0,3}$/;
  //       maxLength = 3;
  //       break;

  //     default:
  //       return;
  //   }

  //   if (currentValue.length >= maxLength) {
  //     event.preventDefault();
  //     return;
  //   }

  //   if (!regex.test(currentValue + char)) {
  //     event.preventDefault();
  //   }
  // }

  // sanitizePaste(event: ClipboardEvent): void {
  //   event.preventDefault();

  //   const clipboardData = event.clipboardData || (window as any).clipboardData;
  //   const pastedText = clipboardData.getData('text');

  //   const sanitizedText = pastedText.replace(/[^\d.]/g, '');

  //   const input = event.target as HTMLInputElement;
  //   const selectionStart = input.selectionStart || 0;
  //   const selectionEnd = input.selectionEnd || 0;

  //   const currentValue = input.value;

  //   input.value =
  //     currentValue.slice(0, selectionStart) +
  //     sanitizedText +
  //     currentValue.slice(selectionEnd);

  //   const newCursorPosition = selectionStart + sanitizedText.length;
  //   input.setSelectionRange(newCursorPosition, newCursorPosition);
  // }

  getError(row: any, field: string, error: string) {
    return InputValidators.getError(this.getFormGroup(row), field, error);
  }

  preventInvalidChars(event: KeyboardEvent, field: string) {
    InputValidators.preventInvalidChars(event, field);
  }

  sanitizePaste(event: ClipboardEvent) {
    InputValidators.sanitizePaste(event);
  }

  validateTotalQuantity(): void {
    this.rows.valueChanges.subscribe(() => {
      const mainIndentQuantity = Number(this.prefetchQuantity || 0);
      const maxAllowed = Math.floor(mainIndentQuantity * 1.1);

      const total = this.rows.controls.reduce((acc, row) => {
        return acc + Number(row.get('quantity')?.value || 0);
      }, 0);

      this.rows.controls.forEach((row) => {
        const control = row.get('quantity');
        if (!control) return;

        const errors = { ...(control.errors || {}) };

        if (total > maxAllowed) {
          errors['quantityExceedsMainIndent'] = true;
        } else {
          delete errors['quantityExceedsMainIndent'];
        }

        control.setErrors(Object.keys(errors).length ? errors : null);
      });
    });
  }

  isMilkTypeReadonly(index: number): boolean {
    return this.isEditMode && index === 0;
  }

  // async loadinitialData() {
  //   try {
  //     forkJoin({
  //       masterData:
  //         this.masterservice.getCreateIndentDataMilkAndPlantSupplier(
  //           masterFormData,
  //         ),
  //       // vehicledata: this.masterservice.getVehicleData(VehicleFormData),
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
}
