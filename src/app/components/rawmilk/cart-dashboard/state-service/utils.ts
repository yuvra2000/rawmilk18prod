import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';

export function createReportParams(filterValues?: any, type?: any) {
  //   let type = this.isFrenchise ? 'franchise' : 'adda';
  console.log('Creating report params with filter values:', filterValues);
  return createFormData(token, {
    type: type || 'adda',
    mode: 'dashboard',
    metric: 'total',
    key:
      type === 'franchise'
        ? filterValues?.franchise_code?.code
        : filterValues?.adda_code?.code,
    group_id: GroupId,
  });
}
