import {
  createFormData,
  GroupId,
} from '../../../../shared/utils/shared-utility.utils';
const token = localStorage.getItem('AccessToken') || '';

export interface AddaWiseDynamicPayload {
  header?: string[];
  body?: Record<string, any>[];
}

export function createReportParams(filterValues?: any) {
  return createFormData(token, {
    group_id: GroupId,
    fromDate: filterValues?.from || filterValues?.fromDate || '',
    toDate: filterValues?.to || filterValues?.toDate || '',
  });
}
export function createMasterParams() {
  return createFormData(token, {
    group_id: GroupId,
  });
}
