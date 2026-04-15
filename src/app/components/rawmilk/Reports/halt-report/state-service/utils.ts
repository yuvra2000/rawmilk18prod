import { createFormData } from '../../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';

export function createReportParams(
  dateFrom: string,
  dateTo?: string,
  filterValues?: any,
) {
  const formattedFromDate = formatDateTimeForApi(
    filterValues?.from || dateFrom,
  );
  const formattedToDate = formatDateTimeForApi(
    filterValues?.to || dateTo || dateFrom,
  );

  console.log('Creating report params with', {
    dateFrom: formattedFromDate,
    dateTo: formattedToDate,
    filterValues,
  });

  return createFormData(token, {
    from_date: formattedFromDate,
    to_date: formattedToDate,
    vehicle_imei:
      filterValues?.vehicle_imei?.map((v: any) => v.id).join(',') || '',
    threshold: filterValues?.threshold || '',
    geofence_id: filterValues?.geofence_id?.id || '',
  });
}

function formatDateTimeForApi(value?: string): string {
  if (!value) return '';

  const normalized = value.trim().replace('T', ' ');

  // Already includes seconds
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }

  // Add seconds when value is YYYY-MM-DD HH:mm
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(normalized)) {
    return `${normalized}:00`;
  }

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return normalized;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  const seconds = String(parsed.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

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
      id: item.ImeiNo,
      name: vehicleNo,
    };
  });
}

export function mapHaltReportData(rawData: any): any[] {
  if (!rawData) return [];

  if (Array.isArray(rawData)) {
    return rawData;
  }

  if (typeof rawData === 'object') {
    return Object.entries(rawData).flatMap(([vehicleKey, rows]) => {
      if (!Array.isArray(rows)) return [];

      return rows.map((row: any) => ({
        ...row,
        vehicle: row?.vehicle || vehicleKey,
      }));
    });
  }

  return [];
}
