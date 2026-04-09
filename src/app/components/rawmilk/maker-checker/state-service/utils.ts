import { createFormData } from '../../../../shared/utils/shared-utility.utils';
const token = localStorage.getItem('AccessToken') || '';
export function createReportParams(filterValues?: any) {
  return createFormData(token, {
    ForApp: '0',
    userId: filterValues?.userId?.id || '',
    maker_checker: filterValues?.maker_checker?.id || '',
  });
}
