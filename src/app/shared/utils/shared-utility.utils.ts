import { FieldConfig } from '../components/filter-form/filter-form.component';

export function createFormData(
  token: string = localStorage.getItem('AccessToken') || '',
  params: Record<string, string> = {},
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
  // ✅ Check if response is successful
  if (response.Result === 'Session Expired') {
    toastService.error(
      response.Message || 'Session expired. Please log in again.',
    );
    return false;
  }
  if (response?.Status === 'success' || response?.success) {
    const message =
      successMessage || response?.message || 'Operation completed successfully';
    toastService.success(message);

    // ✅ Execute success callback if provided
    if (successCallback) {
      const result = successCallback();
      // Handle async callbacks
      if (result instanceof Promise) {
        result.catch((err) => {
          console.error('Error in success callback:', err);
        });
      }
    }
    return true;
  } else {
    // ✅ Show error message
    const message =
      errorMessage || response?.Data || response?.message || 'Operation failed';
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
