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

const resolveOptionCode = (value: any): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value?.code || value?.id || '');
};

const resolveOptionName = (value: any): string => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value?.name || '');
};

const resolveDay = (dayValue: any): number | string => {
  if (dayValue === null || dayValue === undefined || dayValue === '') {
    return '';
  }
  if (typeof dayValue === 'object') {
    const raw = dayValue?.id ?? dayValue?.value ?? dayValue?.day;
    const asNumber = Number(raw);
    return Number.isNaN(asNumber) ? raw : asNumber;
  }
  const asNumber = Number(dayValue);
  return Number.isNaN(asNumber) ? dayValue : asNumber;
};

export const buildPayload = (formValue: any): any[] => {
  const payload: any[] = [];

  const addaCode = resolveOptionCode(formValue?.adda_code || formValue?.adda);
  const addaName = resolveOptionName(formValue?.adda_code || formValue?.adda);
  const noOfCart = Number(formValue?.noOfCart || 0);
  const noOfFranchise = Math.max(1, Number(formValue?.noOfFranchise || 1));

  for (let i = 1; i <= noOfFranchise; i++) {
    const suffix = i === 1 ? '' : `_${i}`;
    const franchiseValue = formValue?.[`franchise_code${suffix}`];
    const timingRows = formValue?.[`franchiseDetails${suffix}`] || [];

    const franchiseCode = resolveOptionCode(franchiseValue);
    const franchiseName = resolveOptionName(franchiseValue);

    if (
      !franchiseCode ||
      !Array.isArray(timingRows) ||
      timingRows.length === 0
    ) {
      continue;
    }

    timingRows.forEach((timing: any) => {
      payload.push({
        franchise_name: franchiseName,
        franchise_code: franchiseCode,
        adda_code: addaCode,
        adda_name: addaName,
        noOfCart,
        start_time: timing?.start_time || timing?.startTime || '',
        end_time: timing?.end_time || timing?.endTime || '',
        day: resolveDay(timing?.day),
      });
    });
  }

  return payload;
};

export const editParams = (data: any, formData: any) => {
  console.log('FOrmdata', formData, data);
  return createFormData(token, {
    mappingId: data?._id?.$oid,
    status: formData?.status?.id,
    adda_code: formData.adda_code?.id,
    franchise_code: formData.franchise_code?.id,
    start_time: formData.start_time,
    end_time: formData.end_time,
    day: formData?.day?.id,
    noOfCart: formData?.noOfCart,
  });
};
export const addParams = (formData: any) => {
  const payload = buildPayload(formData);
  return createFormData(token, {
    group_id: GroupId,
    noOfFranchise: Number(formData?.noOfFranchise || 1),
    payload: JSON.stringify(payload),
  });
};
