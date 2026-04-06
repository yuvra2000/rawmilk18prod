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
