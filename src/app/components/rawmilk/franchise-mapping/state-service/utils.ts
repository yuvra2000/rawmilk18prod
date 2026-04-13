import {
  createFormData,
  GroupId,
  token,
} from '../../../../shared/utils/shared-utility.utils';

export const createMasterParams = () => {
  return createFormData(token, {
    group_id: GroupId,
  });
};
export const addParams = (formData: any) => {
  return createFormData(token, {
    adda_code: formData.adda_code?.id,
    franchise_code: formData.franchise_code?.id,
    group_id: GroupId,
  });
};
