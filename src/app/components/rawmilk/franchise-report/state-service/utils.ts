import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';

export function mapVehicleListToOptions(vehicleList: any): any[] {
  if (!vehicleList) {
    return [];
  }

  const normalizedList = Array.isArray(vehicleList)
    ? vehicleList
    : Object.values(vehicleList);
  return normalizedList.map((item: any) => {
    const vehicleNo = item?.VehicleNo || item?.vehicleNo || '';
    return {
      id: vehicleNo,
      name: vehicleNo,
    };
  });
}

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
    exception_type: filterValues?.exception_type?.id || '',
    group_id: GroupId,
  });
}
