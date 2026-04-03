import { firstValueFrom } from 'rxjs';
import { createFormData } from '../../../../shared/utils/shared-utility.utils';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { computed, Signal } from '@angular/core';

const token = localStorage.getItem('AccessToken') || '';

export async function getMccOptionsForSupplier(
  supplier: any,
  service: any,
): Promise<any[]> {
  if (!supplier?.id) return [];
  const formData = createFormData(token, {
    supplier_id: supplier.id,
    GroupId: localStorage.getItem('GroupId') || '',
    ForApp: '0',
  });
  const response = await firstValueFrom(service.getMCCData(formData));
  return [];
}

export const masterFormData = createFormData(token, {
  GroupId: localStorage.getItem('GroupId') || '',
  ForApp: '0',
});
export const VehicleFormData = createFormData(token, {
  ForWeb: '1',
});
export const mccformdata = createFormData(token, {
  GroupId: localStorage.getItem('GroupId') || '',
  supplier_id: localStorage.getItem('supplier_id') || '',
  ForApp: '0',
});

// import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

// export class QuantityValidators {
//   // ✅ TOTAL SUM VALIDATION
//   static totalNotExceed(getMaxValue: () => number, percent = 1.1): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (!(control instanceof FormArray)) return null;

//       const maxAllowed = Math.floor((getMaxValue() || 0) * percent);

//       const total = control.controls.reduce((sum, row) => {
//         return sum + Number(row.get('quantity')?.value || 0);
//       }, 0);

//       // ✅ Apply error on EACH quantity field (UI friendly)
//       control.controls.forEach((row) => {
//         const qty = row.get('quantity');
//         if (!qty) return;

//         const errors = { ...(qty.errors || {}) };

//         if (total > maxAllowed) {
//           errors['totalExceeded'] = true;
//         } else {
//           delete errors['totalExceeded'];
//         }

//         qty.setErrors(Object.keys(errors).length ? errors : null);
//       });

//       return total > maxAllowed ? { totalExceeded: true } : null;
//     };
//   }

//   static mccNotExceedParent(
//     getRows: () => FormArray,
//     getMccs: () => FormArray,
//   ): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       if (!(control instanceof FormArray)) return null;

//       const rows = getRows();
//       const mccs = getMccs();

//       for (let i = 0; i < rows.length; i++) {
//         const parentQty = Number(rows.at(i).get('quantity')?.value || 0);

//         let childTotal = 0;

//         mccs.controls.forEach((mcc) => {
//           const chambers = mcc.get('chambers') as FormArray;
//           const chamber = chambers?.at(i);

//           if (chamber) {
//             childTotal += Number(chamber.get('quantity')?.value || 0);
//           }
//         });

//         if (childTotal > parentQty) {
//           return { mccExceedsParent: true }; // ✅ only return
//         }
//       }

//       return null;
//     };
//   }
// }

// import {
//   AbstractControl,
//   ValidationErrors,
//   ValidatorFn,
//   FormArray,
// } from '@angular/forms';

export class QuantityValidators {
  // ✅ 1. TOTAL SUM VALIDATION (unchanged but clean)
  static totalNotExceed(getMaxValue: () => number, percent = 1.1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) return null;

      const maxAllowed = Math.floor((getMaxValue() || 0) * percent);

      const total = control.controls.reduce((sum, row) => {
        return sum + Number(row.get('quantity')?.value || 0);
      }, 0);

      control.controls.forEach((row) => {
        const qty = row.get('quantity');
        if (!qty) return;

        const errors = { ...(qty.errors || {}) };

        if (total > maxAllowed) {
          errors['totalExceeded'] = true;
        } else {
          delete errors['totalExceeded'];
        }

        qty.setErrors(Object.keys(errors).length ? errors : null);
      });

      return total > maxAllowed ? { totalExceeded: true } : null;
    };
  }

  // ✅ 2. SIGNAL-BASED MCC VALIDATION (NEW APPROACH)
  static mccNotExceedParentSignal(
    validationState: Signal<{ index: number; exceeded: boolean }[]>,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) return null;

      const state = validationState();

      let hasError = false;

      state.forEach((item) => {
        const row = control.at(item.index);
        const qty = row?.get('quantity');
        if (!qty) return;

        const errors = { ...(qty.errors || {}) };

        if (item.exceeded) {
          errors['mccExceedsParent'] = true;
          hasError = true;
        } else {
          delete errors['mccExceedsParent'];
        }

        qty.setErrors(Object.keys(errors).length ? errors : null);
      });

      return hasError ? { mccExceedsParent: true } : null;
    };
  }

  // ✅ 3. PURE COMPUTED LOGIC (REUSABLE)
  static buildMccValidationState(
    rowsSignal: Signal<any[]>,
    mccsSignal: Signal<any[]>,
  ) {
    return computed(() => {
      const rows = rowsSignal();
      const mccs = mccsSignal();

      if (!rows || !mccs) return [];

      return rows.map((row: any, i: number) => {
        const parentQty = Number(row?.quantity || 0);

        let childTotal = 0;

        mccs.forEach((mcc: any) => {
          const chamber = mcc?.chambers?.[i];
          if (chamber) {
            childTotal += Number(chamber.quantity || 0);
          }
        });

        return {
          index: i,
          parentQty,
          childTotal,
          exceeded: childTotal > parentQty,
          remaining: parentQty - childTotal,
        };
      });
    });
  }
}

export class InputValidators {
  // ✅ common error checker
  static getError(row: any, field: string, error: string): boolean {
    const control = row?.get(field);
    return !!(control && control.hasError(error));
  }

  // ✅ keypress validation
  static preventInvalidChars(event: KeyboardEvent, field: string): void {
    const char = event.key;
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)
    ) {
      return;
    }

    let regex: RegExp;
    let maxLength = 0;

    switch (field) {
      case 'temperature':
        regex = /^-?\d{0,2}(\.\d{0,2})?$/;
        maxLength = 6;
        break;

      case 'quantity':
        regex = /^\d{0,5}$/;
        maxLength = 5;
        break;

      case 'fat':
      case 'snf':
        regex = /^\d{0,2}(\.\d{0,2})?$/;
        maxLength = 5;
        break;

      case 'mbrt':
        regex = /^\d{0,3}$/;
        maxLength = 3;
        break;

      default:
        return;
    }

    if (currentValue.length >= maxLength) {
      event.preventDefault();
      return;
    }

    if (!regex.test(currentValue + char)) {
      event.preventDefault();
    }
  }

  // ✅ paste validation
  static sanitizePaste(event: ClipboardEvent): void {
    event.preventDefault();

    const clipboardData = event.clipboardData || (window as any).clipboardData;

    const pastedText = clipboardData.getData('text');

    const sanitizedText = pastedText.replace(/[^\d.]/g, '');

    const input = event.target as HTMLInputElement;

    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    const currentValue = input.value;

    input.value =
      currentValue.slice(0, selectionStart) +
      sanitizedText +
      currentValue.slice(selectionEnd);

    const newCursorPosition = selectionStart + sanitizedText.length;

    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }
}
