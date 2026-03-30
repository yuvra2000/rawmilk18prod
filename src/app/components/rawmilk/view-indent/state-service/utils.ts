import { firstValueFrom } from 'rxjs';

const token = localStorage.getItem('AccessToken') || '';
export async function getMccOptionsForSupplier(
  supplier: any,
  service: any,
): Promise<any[]> {
  if (!supplier?.id) return [];
  const formData = {
    AccessToken: token,
    supplier_id: supplier.id,
    GroupId: localStorage.getItem('GroupId') || '',
    ForApp: '0',
  };
  const response: any = await firstValueFrom(service.getMCCData(formData));
  return response?.Data || [];
}
const toDate = new Date();
toDate.setDate(toDate.getDate() + 7);
export const formData = {
  AccessToken: token,
  from: new Date().toISOString().split('T')[0],
  to: toDate.toISOString().split('T')[0],
  GroupId: localStorage.getItem('GroupId') || '',
  UserType: '',
  SubRole: '',
  ForWeb: '1',
};
export const masterFormData = {
  AccessToken: token,
  GroupId: localStorage.getItem('GroupId') || '',
  ForApp: '0',
};
