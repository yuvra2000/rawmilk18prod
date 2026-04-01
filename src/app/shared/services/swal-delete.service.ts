import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export interface SwalDeleteConfig {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  reverseButtons?: boolean;
}

export interface SwalSuccessConfig {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonColor?: string;
}

export interface SwalErrorConfig {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonColor?: string;
}

export interface DeleteServiceConfig {
  // SweetAlert confirmation config
  confirmConfig: SwalDeleteConfig;

  // Success message config
  successConfig?: SwalSuccessConfig;

  // Error message config
  errorConfig?: SwalErrorConfig;

  // API config
  apiCall: Observable<any>;

  // Response handling
  successCondition?: (response: any) => boolean;
  getSuccessMessage?: (response: any, originalData: any) => string;
  getErrorMessage?: (response: any, originalData: any) => string;

  // Loading spinner
  showSpinner?: boolean;

  // Callbacks
  onSuccess?: (response: any, originalData: any) => void;
  onError?: (error: any, originalData: any) => void;
  onCancel?: (originalData: any) => void;
}

@Injectable({
  providedIn: 'root',
})
export class SwalDeleteService {
  private toast = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  /**
   * Handle delete operation with SweetAlert confirmation and API call
   * @param data The data object being deleted
   * @param config Configuration for the entire delete operation
   * @returns Promise<boolean> - true if deleted successfully, false otherwise
   */
  async handleDelete<T = any>(
    data: T,
    config: DeleteServiceConfig,
  ): Promise<boolean> {
    try {
      // Show confirmation dialog
      const result: SweetAlertResult = await Swal.fire({
        title: config.confirmConfig.title || 'Are you sure?',
        text: config.confirmConfig.text || 'This action cannot be undone.',
        icon: config.confirmConfig.icon || 'warning',
        showCancelButton: config.confirmConfig.showCancelButton !== false,
        confirmButtonColor: config.confirmConfig.confirmButtonColor || '#d33',
        cancelButtonColor: config.confirmConfig.cancelButtonColor || '#3085d6',
        confirmButtonText:
          config.confirmConfig.confirmButtonText || 'Yes, delete it!',
        cancelButtonText: config.confirmConfig.cancelButtonText || 'Cancel',
        reverseButtons: config.confirmConfig.reverseButtons !== false,
      });

      if (!result.isConfirmed) {
        // User cancelled
        if (config.onCancel) {
          config.onCancel(data);
        }
        return false;
      }

      // Show loading spinner if enabled
      if (config.showSpinner !== false) {
        this.spinner.show();
      }

      // Make API call
      const response = await firstValueFrom(config.apiCall);

      // Hide spinner
      if (config.showSpinner !== false) {
        this.spinner.hide();
      }

      // Check if operation was successful
      const isSuccess = config.successCondition
        ? config.successCondition(response)
        : response.Status === 'success';

      if (isSuccess) {
        // Show success message
        if (config.successConfig !== false) {
          const successMessage = config.getSuccessMessage
            ? config.getSuccessMessage(response, data)
            : 'Item deleted successfully.';

          await Swal.fire({
            title: config.successConfig?.title || 'Deleted!',
            text: successMessage,
            icon: config.successConfig?.icon || 'success',
            confirmButtonColor:
              config.successConfig?.confirmButtonColor || '#3085d6',
          });
        }

        // Call success callback
        if (config.onSuccess) {
          config.onSuccess(response, data);
        }

        return true;
      } else {
        // Handle API error response
        const errorMessage = config.getErrorMessage
          ? config.getErrorMessage(response, data)
          : 'Failed to delete item.';

        if (config.errorConfig !== false) {
          await Swal.fire({
            title: config.errorConfig?.title || 'Error!',
            text: errorMessage,
            icon: config.errorConfig?.icon || 'error',
            confirmButtonColor:
              config.errorConfig?.confirmButtonColor || '#d33',
          });
        }

        // Call error callback
        if (config.onError) {
          config.onError(response, data);
        }

        return false;
      }
    } catch (error) {
      // Hide spinner on error
      if (config.showSpinner !== false) {
        this.spinner.hide();
      }

      console.error('Delete operation error:', error);

      // Show error message
      if (config.errorConfig !== false) {
        await Swal.fire({
          title: config.errorConfig?.title || 'Error!',
          text: config.errorConfig?.text || 'An unexpected error occurred.',
          icon: config.errorConfig?.icon || 'error',
          confirmButtonColor: config.errorConfig?.confirmButtonColor || '#d33',
        });
      }

      // Show toast notification
      this.toast.error('Operation failed. Please try again.');

      // Call error callback
      if (config.onError) {
        config.onError(error, data);
      }

      return false;
    }
  }

  /**
   * Simple confirmation dialog without API call
   * @param config SweetAlert configuration
   * @returns Promise<boolean> - true if confirmed, false if cancelled
   */
  async confirm(config: SwalDeleteConfig): Promise<boolean> {
    const result: SweetAlertResult = await Swal.fire({
      title: config.title || 'Are you sure?',
      text: config.text || 'Please confirm this action.',
      icon: config.icon || 'question',
      showCancelButton: config.showCancelButton !== false,
      confirmButtonColor: config.confirmButtonColor || '#3085d6',
      cancelButtonColor: config.cancelButtonColor || '#6c757d',
      confirmButtonText: config.confirmButtonText || 'Yes',
      cancelButtonText: config.cancelButtonText || 'Cancel',
      reverseButtons: config.reverseButtons !== false,
    });

    return result.isConfirmed;
  }

  /**
   * Show success message
   * @param config Success message configuration
   */
  async showSuccess(config: SwalSuccessConfig): Promise<void> {
    await Swal.fire({
      title: config.title || 'Success!',
      text: config.text || 'Operation completed successfully.',
      icon: config.icon || 'success',
      confirmButtonColor: config.confirmButtonColor || '#3085d6',
    });
  }

  /**
   * Show error message
   * @param config Error message configuration
   */
  async showError(config: SwalErrorConfig): Promise<void> {
    await Swal.fire({
      title: config.title || 'Error!',
      text: config.text || 'Something went wrong.',
      icon: config.icon || 'error',
      confirmButtonColor: config.confirmButtonColor || '#d33',
    });
  }
}
