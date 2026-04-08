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
  console.log('FOrmdata', formData);
  return createFormData(token, {
    name: formData?.name || '',
    latlng: formData?.latlng || '',
    region_code: formData.region_code,
    radius: '0.5',
    addaId: data?._id?.$oid,
    status: formData?.status?.id,
  });
};
export const addParams = (formData: any) => {
  return createFormData(token, {
    name: formData?.name || '',
    latlng: formData?.latlng || '',
    region_code: String(formData?.region_code?.id || ''),
    radius: '0.5',
    code: formData.code,
    group_id: GroupId,
  });
};
