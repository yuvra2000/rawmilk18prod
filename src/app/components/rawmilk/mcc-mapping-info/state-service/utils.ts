import { createFormData } from '../../../../shared/utils/shared-utility.utils';
const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';
export function createReportParams(filterValues?: any) {
  return createFormData(token, {
    MaxVehCapacity: filterValues?.MaxVehCapacity || '',
    MinVehCapacity: filterValues?.MinVehCapacity || '',
    StandByVehCount: filterValues?.StandByVehCount || '',
    ForWeb: '1',
    MccId: filterValues?.MccId?.id || '',
    VehicleType: filterValues?.VehicleType?.id || '',
  });
}
