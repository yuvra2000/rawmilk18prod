import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import { FieldConfig, FilterFormComponent, Option } from '../../../shared/components/filter-form/filter-form.component';
import { remoteFilterFields } from './state-service/config';
import { RemoteLockUnlockService } from './remote-lock-unlock.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-remote-lock-unlock',
  standalone: true,
  imports: [CommonModule, CollapseWrapperComponent, FilterFormComponent],
  templateUrl: './remote-lock-unlock.component.html',
  styleUrl: './remote-lock-unlock.component.scss'
})
export class RemoteLockUnlockComponent implements OnInit {
  private service = inject(RemoteLockUnlockService);
  private alertService = inject(AlertService);

  token = localStorage.getItem('AccessToken') || '';

  // State signals
  tankerList = signal<any[]>([]);
  selectedTanker = signal<any>(null);
  showControlPanel = signal(false);
  isLoading = signal(false);
  waitMessage = signal('');

  // Status display
  currentSupplyStatus = signal('');
  currentStatus = signal('');
  deviceTime = signal('');
  currentDeviceType = signal('');
  currentImei = signal('');
  batteryVoltage = signal('');

  // Filter fields computed from tanker options
  filterfields = computed<FieldConfig[]>(() =>
    remoteFilterFields(this.getTankerOptions())
  );

  ngOnInit() {
    this.loadTankerList();
  }

  /**
   * Transform tanker list to Option format for dropdown
   */
  private getTankerOptions(): Option[] {
    return this.tankerList().map(tanker => ({
      id: tanker.ImeiNo || tanker.imei || '',
      name: `${tanker.VehicleNo || 'N/A'} (${tanker.Location || 'N/A'})`,
      ...tanker, // Include full object for access in handler
    }));
  }

  /**
   * Load tanker list from API
   */
  private loadTankerList() {
    this.service.getTankerList(this.token).subscribe({
      next: (response: any) => {
        // API returns VehicleList as object with IMEI keys, each containing array of vehicles
        if (response?.VehicleList && typeof response.VehicleList === 'object') {
          const tankers: any[] = [];
          Object.values(response.VehicleList).forEach((imeiGroup: any) => {
            if (Array.isArray(imeiGroup)) {
              tankers.push(...imeiGroup);
            }
          });
          this.tankerList.set(tankers);
        } else if (response && Array.isArray(response)) {
          this.tankerList.set(response);
        } else if (response?.Data && Array.isArray(response.Data)) {
          this.tankerList.set(response.Data);
        }
      },
      error: (err) => {
        console.error('Error loading tanker list:', err);
        this.alertService.error('Failed to load tanker list');
      }
    });
  }

  /**
   * Handle filter form submission (tanker selection)
   */
  onFormSubmit(data: any) {
    const selectedOption = data?.tanker;
    if (!selectedOption) {
      this.showControlPanel.set(false);
      this.selectedTanker.set(null);
      return;
    }

    // Set selected tanker (data.tanker is the full option object from our mapping)
    this.selectedTanker.set(selectedOption);
    this.updateStatus(selectedOption);
    this.showControlPanel.set(true);
  }

  /**
   * Update status display based on selected tanker
   */
  private updateStatus(tanker: any) {
    // Parse supply voltage status (API returns as string)
    const voltage = parseInt(String(tanker.suplyVoltage)) || 0;
    if (voltage >= 10 && voltage <= 48) {
      this.currentSupplyStatus.set('Connected');
    } else {
      this.currentSupplyStatus.set('Not Connected');
    }

    // Set door/lock status based on location
    let doorVal = '';
    if (tanker.Location === 'Main hole') {
      doorVal = tanker.MainHoleDoor;
    } else if (tanker.Location === 'Delivery hole') {
      doorVal = tanker.DeliveryDoor;
    } else {
      // Fallback: try DeliveryDoor first, then MainHoleDoor, prefer non-empty
      doorVal = tanker.DeliveryDoor || tanker.MainHoleDoor;
    }

    // Map door status to lock status
    if (doorVal === 'Open') {
      this.currentStatus.set('Unlocked');
    } else if (doorVal === 'Close') {
      this.currentStatus.set('Locked');
    } else if (!doorVal) {
      this.currentStatus.set('N/A'); // Empty or undefined
    } else {
      this.currentStatus.set(doorVal);
    }

    this.deviceTime.set(tanker.DeviceTime || 'N/A');
    this.currentDeviceType.set(tanker.DeviceType || '');
    this.currentImei.set(tanker.ImeiNo || '');
    this.batteryVoltage.set(String(voltage || ''));
  }

  /**
   * Check if lock button should be hidden
   */
  get isLockButtonHidden(): boolean {
    const deviceType = parseInt(this.currentDeviceType());
    return deviceType === 13;
  }

  /**
   * Lock device
   */
  lockDevice() {
    if (!this.currentImei()) {
      this.alertService.error('Device IMEI not found');
      return;
    }

    this.isLoading.set(true);
    this.waitMessage.set('Processing... Please wait ~60 seconds');

    this.service.remoteLockUnlock(this.token, '1', this.currentImei()).subscribe({
      next: (res: any) => {
        const status = res?.Status || res?.status;
        const message = res?.Message || res?.message;
        const isSuccess =
          status === 'Success' ||
          status === 'success' ||
          message === 'Request Sent Successfully';

        if (isSuccess) {
          this.alertService.success('Lock request sent successfully');
        } else {
          this.alertService.error(message || 'Failed to send lock request');
        }

        // Wait 60s before clearing loading state
        setTimeout(() => {
          this.isLoading.set(false);
          this.waitMessage.set('');
        }, 60000);
      },
      error: (err) => {
        console.error('Lock error:', err);
        this.alertService.error('An error occurred while locking device');
        this.isLoading.set(false);
        this.waitMessage.set('');
      }
    });
  }

  /**
   * Unlock device
   */
  unlockDevice() {
    if (!this.currentImei()) {
      this.alertService.error('Device IMEI not found');
      return;
    }

    this.isLoading.set(true);
    this.waitMessage.set('Processing... Please wait ~60 seconds');

    this.service.remoteLockUnlock(this.token, '0', this.currentImei()).subscribe({
      next: (res: any) => {
        const status = res?.Status || res?.status;
        const message = res?.Message || res?.message;
        const isSuccess =
          status === 'Success' ||
          status === 'success' ||
          message === 'Request Sent Successfully';

        if (isSuccess) {
          this.alertService.success('Unlock request sent successfully');
        } else {
          this.alertService.error(message || 'Failed to send unlock request');
        }

        // Wait 60s before clearing loading state
        setTimeout(() => {
          this.isLoading.set(false);
          this.waitMessage.set('');
        }, 60000);
      },
      error: (err) => {
        console.error('Unlock error:', err);
        this.alertService.error('An error occurred while unlocking device');
        this.isLoading.set(false);
        this.waitMessage.set('');
      }
    });
  }
}
