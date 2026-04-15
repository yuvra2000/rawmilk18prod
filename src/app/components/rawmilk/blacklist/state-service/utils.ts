import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';

export function createReportParams(filterValues?: any) {
  return createFormData(token, {
    Type: filterValues?.Type?.id || 'All',
    Transporters:
      JSON.stringify(filterValues?.Transporters?.map((t: any) => t.id)) || '',
    Vehicles:
      JSON.stringify(filterValues?.Vehicles?.map((v: any) => v.id)) || '',
    group_id: GroupId,
  });
}
export function createMasterParams() {
  return createFormData(token, {
    GroupId: GroupId,
    ForApp: '0',
  });
}
export function createTankerParams() {
  return createFormData(token, {
    ForWeb: '1',
  });
}
