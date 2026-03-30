import { firstValueFrom } from 'rxjs';
import { createFormData } from '../../../../shared/utils/shared-utility.utils';

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
const toDate = new Date();
toDate.setDate(toDate.getDate() + 7);
export const formData = createFormData(token, {
  FromDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  ToDate: toDate.toISOString().split('T')[0], // Date 7 days in the future in YYYY-MM-DD format
  GroupId: localStorage.getItem('GroupId') || '',
  UserType: localStorage.getItem('usertype') || '',
  SubRole: '',
  ForWeb: '1',
});
export const masterFormData = createFormData(token, {
  GroupId: localStorage.getItem('GroupId') || '',
  ForApp: '0',
});
