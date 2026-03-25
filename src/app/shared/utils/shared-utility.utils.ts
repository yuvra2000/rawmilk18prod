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
