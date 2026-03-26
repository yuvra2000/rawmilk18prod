import { computed, inject, Injectable, signal } from '@angular/core';
import { commonService } from './common.service'; // ✅ your existing CRUD wrapper
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

// ✅ Define a request interface (type safety)
export interface VehicleTrackingRequest {
  runDate: string;
  imei: string;
  groupId: string;
  accountId: string;
  timeInterval?: string; // optional
  portal?: string;
  endDate?: string;
}

// ✅ Define a response interface (you can refine based on API)
export interface VehicleTrackingResponse {
  latitude: number;
  longitude: number;
  vehicleNo: string;
  driver: string;
  phoneNo: string;
  dateTime: string;
  address: string;
  transporter: string;
  geoCoordinate: string;
}
interface Marker {
  position: { lat: number; lng: number };
  title: string;
  icon: {
    url: string;
    // scaledSize: { width: number; height: number }
  };
  params: {};
}
@Injectable({ providedIn: 'root' })
export class VehicleTrackingService {
  private commonService = inject(commonService);
  private authService = inject(AuthService);
  // token: any = this.storage.getItem('AccessToken') || '';
  // AccountData: any = this.storage.getItem('AccountData') || '';
  //  readonly AccountData=computed(() => this.authService?.currentUser())
  // Optional Signal Cache (can be used for state sharing)
  trackingData = signal<VehicleTrackingResponse[]>([]);

  /**
   * Fetch vehicle tracking data from API
   */
  locations = signal<Location[]>([]);
  private trackingMarkers = computed<Marker[]>(() =>
    this.locations().map((loc: any, index) => ({
      position: { lat: Number(loc.lat), lng: Number(loc.long) },
      title: loc?.vnumber ?? `Vehicle ${index + 1}`,
      icon: { url: '' }, // आइकन Viewer में सेट होगा
      params: {
        vehicleNo: loc.vname ?? '',
        Imei: loc.imei ?? '',
        'Server Time': loc?.server_time ?? '',
        Distance: loc?.distance ?? '',
        //         driver: this.vehicleInfo().Driver ?? '',
        //         phoneNo: this.vehicleInfo().DriverMobile ?? '',
        dateTime: loc.device_time ?? '',
        'speed(Km/hr)': loc.speed ?? '',
        Address: '',

        Engine: loc?.engineStatus ?? '',
        Battery: loc?.BatteryVoltage ?? '',
        'Lat Long': loc?.lat + ',' + loc?.long,

        title: 'Vehicle Details',
      },
      markerType: 'tracking', // <-- डेटा का प्रकार बताएँ
      isStart: index === 0, // <-- स्टार्ट फ्लैग
      isEnd: index === this.locations().length - 1, // <-- एंड फ्लैग
    })),
  );
  async fetchVehicleTracking(req: VehicleTrackingRequest): Promise<any[]> {
    const formData = new FormData();
    const endDateToUse =
      req.endDate && req.endDate.trim() !== ''
        ? req.endDate
        : this.getCurrentDateTime();
    formData.append('startdate', req.runDate);
    formData.append('enddate', this.getCurrentDateTime());
    formData.append('time_interval', req.timeInterval || '120');
    formData.append('imei', req.imei);
    // formData.append('group_id', this.AccountData()?.GroupId||'');
    // formData.append('AccountId', this.AccountData()?.AccountId||'');
    formData.append('portal', req.portal || 'itraceit');

    try {
      const response: any = await firstValueFrom(
        this.commonService.vehicleTrackingV2New(formData),
      );
      console.log('Vehicle Tracking Response:', response);
      this.trackingData.set(response?.data || []);
      this.locations.set(response?.data || []);
      return this.trackingMarkers() || [];
    } catch (error) {
      console.error('Vehicle tracking API failed:', error);
      return [];
    }
  }

  /** Utility function to get formatted current date-time */
  private getCurrentDateTime(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }

  async fetchVehicleAlert(req: any): Promise<any[]> {
    const formData = new FormData();
    // formData.append('forGroup', this.AccountData()?.GroupId||'');
    formData.append('shipment_no', req?.shipment_no);

    try {
      const response: any = await firstValueFrom(
        this.commonService.triggerHistoryAT(formData),
      );
      //   this.trackingData.set(response?.data || []);
      console.log(response, 'alerts');
      return response || [];
    } catch (error) {
      console.error('Vehicle tracking API failed:', error);
      return [];
    }
  }
  async fetchTimeline(req: any): Promise<any[]> {
    const formData = new FormData();
    formData.append('from', req?.from);
    formData.append('to', req?.to);
    formData.append('imeis', req?.imeis);
    formData.append('portal', req?.portal);

    try {
      const res: any = await firstValueFrom(
        this.commonService.distanceTimeline(formData),
      );

      // 🔥 SUPER CLEAN SESSION EXPIRE CHECK
      if (this.isSessionExpired(res)) {
        alert('Your session has expired. Please login again.');
        return [];
      }
      const timelineArray: any = Object.values(res?.Data)[0] || [];
      console.log('timelineArray', timelineArray);
      return timelineArray || [];
    } catch (err: any) {
      // 🔥 EVEN IN ERROR CASE → check session expire
      if (this.isSessionExpired(err?.error)) {
        alert('Your session has expired. Please login again.');
        return [];
      }

      console.error('Timeline API failed:', err);
      return [];
    }
  }
  private isSessionExpired(res: any): boolean {
    if (!res) return false;

    const msg = JSON.stringify(res).toLowerCase();

    return (
      msg.includes('session') ||
      msg.includes('expired') ||
      msg.includes('invalid token') ||
      msg.includes('token expired') ||
      res?.code === 401 ||
      res?.status === 401
    );
  }
}
