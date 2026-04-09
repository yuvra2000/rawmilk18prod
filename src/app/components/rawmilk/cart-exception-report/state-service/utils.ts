import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';

export function createReportParams(
  dateFrom: string,
  dateTo?: string,
  filterValues?: any,
) {
  return createFormData(token, {
    fromDate: dateFrom,
    toDate: dateTo || dateFrom,
    franchise_code: filterValues?.franchise_code?.code || '',
    adda_code: filterValues?.adda_code?.code || '',
    cart_no: filterValues?.cart_no?.id || '',
    group_id: GroupId,
  });
}
