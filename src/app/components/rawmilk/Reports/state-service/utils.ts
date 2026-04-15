import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';

export const tannkerFormData = createFormData(token, {
  ForWeb: '1',
});
export const vehicleFormData = createFormData(token, {
  // ForWeb: '1',
});
