import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

/**
 * Get date N days ago in YYYY-MM-DD format
 */
export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
export function sessionCheck(
  res: any,
  toastService: ToastrService,
  router: Router,
) {
  if (
    res?.Message == 'Sorry! Session expired, Please login again ..!' ||
    res?.Result == 'Session Expired due to new login.'
  ) {
    toastService.error(res?.Message || 'Session expired. Please login again.');
    localStorage.clear();
    router.navigate(['/auth/login']);
  }
}
export function handleError(error: any, toast: ToastrService): void {
  console.error('API Error:', error);
  toast.error('An error occurred while loading data');
}
export function getTomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}
