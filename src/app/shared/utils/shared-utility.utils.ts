import { FieldConfig } from '../components/filter-form/filter-form.component';
export const supplier_id = localStorage.getItem('supplier_id') || '';
export const token = localStorage.getItem('AccessToken') || '';
export const GroupId = localStorage.getItem('GroupId') || '';
export const userType = localStorage.getItem('usertype') || '';
export function createFormData(
  token: string = localStorage.getItem('AccessToken') || '',
  params: Record<string, any> = {},
): FormData {
  const formData = new FormData();
  formData.append('AccessToken', token);
  Object.entries(params).forEach(([key, value]) => {
    formData.append(key, value || '');
  });
  return formData;
}
// ✅ NEW: Method to update field options dynamically
export function updateFieldOptions(
  signal: any,
  fieldName: string,
  newOptions: any[],
) {
  signal.update((fields: FieldConfig[]) =>
    fields.map((field) =>
      field.name === fieldName ? { ...field, options: newOptions } : field,
    ),
  );
}
// ✅ ADD THIS TO: src/app/shared/utils/shared-utility.utils.ts

/**
 * Handle API Response Status
 * @param response - API response object
 * @param toastService - Alert service for showing messages
 * @param successCallback - Callback to execute on success
 * @param errorMessage - Custom error message (optional)
 * @param successMessage - Custom success message (optional)
 */
export function handleApiResponse(
  response: any,
  toastService: any,
  successCallback?: (() => void) | (() => Promise<void>),
  errorMessage?: string,
  successMessage?: string,
): boolean {
  if (!response) return false;

  const status = response.Status || response.status;
  const isSuccess =
    status === 'success' || status === 1 || response.success === true;
  const apiMessage = response.Message || response.message;

  // Check for session expiration
  if (
    response.Result === 'Session Expired due to new login.' ||
    status === 'failed' ||
    apiMessage == 'Invalid or expired accesstoken.' ||
    apiMessage == 'Sorry! Session expired, Please login again ..!'
  ) {
    toastService.error(apiMessage || 'Session expired. Please log in again.');
    window.location.href = 'https://secutrak.in/logout';
    return false;
  }
  if (isSuccess) {
    const message =
      apiMessage || successMessage || 'Operation completed successfully';
    console.log('API Success:', message);
    if (message) {
      toastService.success(message);
    }

    if (successCallback) {
      const result = successCallback();
      if (result instanceof Promise) {
        result.catch((err) => console.error('Error in success callback:', err));
      }
    }
    return true;
  } else {
    const message =
      apiMessage || errorMessage || response.Data || 'Operation failed';
    console.log('API Error:', message);
    toastService.error(message);
    return false;
  }
}

/**
 * Handle API Error with Toast
 * @param error - Error object from catch block
 * @param toastService - Alert service
 * @param defaultMessage - Default message if error message not available
 */
export function handleApiError(
  error: any,
  toastService: any,
  defaultMessage: string = 'An error occurred. Please try again later.',
): void {
  const errorMessage =
    error?.error?.message || error?.message || defaultMessage;
  console.error('API Error:', error);
  toastService.error(errorMessage);
}
export function handleSessionExpiry(res: any, toastService: any) {
  // debugger;
  if (
    res?.Result == 'Session Expired due to new login.' ||
    res?.Message == 'Invalid or expired accesstoken.' ||
    res?.Message == 'Sorry! Session expired, Please login again ..!'
  ) {
    toastService.error(res?.Message || 'Session expired. Please log in again.');
    window.location.href = 'https://secutrak.in/logout';
    return true;
  }
  return false;
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
      id: vehicleNo,
      name: vehicleNo,
    };
  });
}
