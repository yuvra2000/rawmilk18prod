import { createFormData } from '../../../../shared/utils/shared-utility.utils';
export const token = localStorage.getItem('AccessToken') || '';
export const filterFormData = createFormData(token, {
  MonthMM: '',
});
