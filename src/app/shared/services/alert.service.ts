import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
  // error(message: string, title: string = 'Error'): void {
  //   this.toastr.error(message, title);
  // }
  async error(message: string, title: string = 'Error'): Promise<void> {
    const delay = 2000; // 3 seconds
    this.toastr.error(message, title);

    await new Promise((resolve) => setTimeout(resolve, delay));
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
  /**
   * Shows a SweetAlert2 confirmation dialog
   * @param title The title of the confirmation dialog
   * @param text The descriptive text for the confirmation
   * @param confirmButtonText The text for the confirm button
   * @param cancelButtonText The text for the cancel button
   * @returns Promise<boolean> true if confirmed, false if cancelled
   */
  async confirmDelete(
    title: string = 'Are you sure?',
    text: string = 'This action cannot be undone.',
    confirmButtonText: string = 'Yes, delete it!',
    cancelButtonText: string = 'Cancel',
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: true,
    });

    return result.isConfirmed;
  }

  /**
   * Shows a SweetAlert2 success message after an action
   * @param title The title of the success message
   * @param text The descriptive text for the success
   */
  async showSuccess(
    title: string = 'Success!',
    text: string = 'Operation completed successfully.',
  ): Promise<void> {
    await Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonColor: '#3085d6',
    });
  }

  /**
   * Shows a SweetAlert2 error message
   * @param title The title of the error message
   * @param text The descriptive text for the error
   */
  async showError(
    title: string = 'Error!',
    text: string = 'Something went wrong.',
  ): Promise<void> {
    await Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonColor: '#d33',
    });
  }

  /**
   * Basic confirm dialog (backwards compatibility)
   * @param message The confirmation message
   * @returns Promise<boolean> true if confirmed, false if cancelled
   */
  confirm(message: string): Promise<boolean> {
    return this.confirmDelete('Confirm', message, 'Yes', 'No');
  }
}
