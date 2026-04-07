import { createFormData } from '../../../../shared/utils/shared-utility.utils';
const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';
export function createReportParams(date: string, filterValues?: any) {
  return createFormData(token, {
    dateFrom: `${date} 00:00:00`,
    dateTo: `${date} 23:59:59`,
    milkType: filterValues?.milkType?.id || '',
    ForApp: '0',
    supplier: filterValues?.supplier?.id || '',
    plant: filterValues?.plant?.id || '',
    user_type: user_type,
    GroupId: GroupId,
  });
}
