import { createFormData } from '../../../../shared/utils/shared-utility.utils';
const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';
export function createReportParams(
  dateFrom: string,
  dateTo?: string,
  filterValues?: any,
) {
  console.log('Creating report params with:', {
    dateFrom,
    dateTo,
    filterValues,
  });
  return createFormData(token, {
    dateFrom: `${dateFrom}`,
    dateTo: `${dateTo || dateFrom}`,
    milkType: filterValues?.milkType?.map((item: any) => item.code) || '',
    ForApp: '0',
    supplier: filterValues?.supplier?.map((item: any) => item.code) || '',
    plant: filterValues?.plant?.map((item: any) => item.code) || '',
    user_type: user_type,
    GroupId: GroupId,
    groupBy: filterValues?.report?.id || '',
  });
}
