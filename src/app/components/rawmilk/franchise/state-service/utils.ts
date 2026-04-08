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
export const editParams = (data: any, formData: any) => {
  console.log('Form Data from editParams', formData);
  return createFormData(token, {
    name: formData?.name || '',
    franchiseId: data?._id?.$oid,
    status: formData?.status?.id,
  });
};
export const addParams = (formData: any) => {
  return createFormData(token, {
    name: formData?.name || '',
    code: formData.code,
    group_id: GroupId,
  });
};
