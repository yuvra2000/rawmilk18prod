import { createFormData } from '../../../../shared/utils/shared-utility.utils';

const token = localStorage.getItem('AccessToken') || '';
const GroupId = localStorage.getItem('GroupId') || '';
const user_type = localStorage.getItem('AccountType') || '';

function formatDateTimeForApi(value: any, defaultTime: string): string {
  const today = new Date().toISOString().split('T')[0];

  if (!value) {
    return `${today} ${defaultTime}`;
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    return `${today} ${defaultTime}`;
  }

  if (stringValue.includes('T')) {
    const [datePart, timePartRaw] = stringValue.split('T');
    const timePart = (timePartRaw || defaultTime).trim();
    if (!timePart) return `${datePart} ${defaultTime}`;
    if (timePart.length === 5) return `${datePart} ${timePart}:00`;
    return `${datePart} ${timePart}`;
  }

  if (stringValue.includes(' ')) {
    const [datePart, timePartRaw] = stringValue.split(' ');
    const timePart = (timePartRaw || defaultTime).trim();
    if (!timePart) return `${datePart} ${defaultTime}`;
    if (timePart.length === 5) return `${datePart} ${timePart}:00`;
    return `${datePart} ${timePart}`;
  }

  return `${stringValue} ${defaultTime}`;
}

export function createReportParams(
  dateFrom: string,
  dateTo?: string,
  filterValues?: any,
) {
  return createFormData(token, {
    fromDate: formatDateTimeForApi(dateFrom, '00:00:00'),
    toDate: formatDateTimeForApi(dateTo || dateFrom, '23:59:59'),
    franchise_code: filterValues?.franchise_code?.code || '',
    adda_code: filterValues?.adda_code?.code || '',
    cart_no: filterValues?.cart_no?.id || '',
    group_id: GroupId,
  });
}
