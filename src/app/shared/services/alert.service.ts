import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private toastr = inject(ToastrService);

  /**
   * Shows a success notification.
   * @param message The main message to display.
   * @param title An optional title for the toast.
   */
  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  /**
   * Shows an error notification.
   * @param message The main message to display.
   * @param title An optional title for the toast.
   */
  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  /**
   * Shows a warning notification.
   * @param message The main message to display.
   * @param title An optional title for the toast.
   */
  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }

  /**
   * Shows an informational notification.
   * @param message The main message to display.
   * @param title An optional title for the toast.
   */
  info(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }
  // alert.service.ts
  confirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  }
}
