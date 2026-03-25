import { computed, inject, Injectable, signal } from '@angular/core';

import { VehicleTrackingService } from '../../../services/vehicle-tracking.service';
import { UniversalModalService } from '../../../services/universal-modal.service';
import { MapModalData } from '../map-modal';
import { commonService } from '../../../services/common.service';
// interface trackingData {
//   isLoading: boolean;
//   error: string | null;
//   TrackingData: [];
// }

interface Marker {
  position: { lat: number; lng: number };
  title: string;
  icon: {
    url: string;
    // scaledSize: { width: number; height: number }
  };
  params: {};
}
interface Location {
  lat: number;
  long: number;
  vehicleNo: string;
  driver: string;
  phoneNo: string;
  dateTime: string;
  address: string;
  title: string;

  //   LatLong: string;
}
// 1. Naya Configuration Interface
export interface MapTrackingOptions {
  title?: string; // Custom Modal Title
  size?: 'lg' | 'xl' | 'xxl'; // Modal Size
  showTimeline?: boolean; // 👈 Timeline On/Off
  drawPolyline?: boolean; // Map par route line draw karni hai ya nahi
  displayTools?: boolean; // Map tools dikhane hain ya nahi
  fetchAlerts?: boolean; // Alert API call karni hai? (Default: true)
  fetchCustomer?: boolean; // Customer API call karni hai? (Default: true)
}
export interface MapTrackingPayload {
  Id: string | number; // Trip ID (Used as MTripId for Customer details)
  ShpNo: string; // Shipment Number (Used for fetching Alerts)
  Imei: string; // Device IMEI Number (Used for Vehicle Tracking)
  RnDt: string; // Run Date / Start Date (Format expected by API)
  CloseDt: string; // Close Date / End Date
  options?: MapTrackingOptions;
  // Optional: Agar future me vehicle/driver info dikhani ho (Aapke commented code ke anusar)
  Driver?: string;
  DriverMobile?: string;
  liveData?: {};
  [key: string]: any; // Catch-all for extra row data if needed
}
@Injectable({
  providedIn: 'root',
})
export class reusableMapLoader {
  private apiService = inject(commonService);
  // private storageService = inject(StorageService)
  locations = signal<Location[]>([]);
  alerts = signal<any[]>([]);
  vehicleInfo = signal<any>({});
  private modalService = inject(UniversalModalService);
  private vehicleTrackingService = inject(VehicleTrackingService);
  // 🗺️ Map Signals
  token: any;
  center = signal({ lat: 26.8467, lng: 80.9462 });
  zoom = signal(8);
  customerData = signal<any[]>([]);
  // private trackingMarkers = computed<Marker[]>(() =>
  //   this.locations().map((loc: any, index) => ({
  //     position: { lat: Number(loc.lat), lng: Number(loc.long) },
  //     title: loc?.vnumber ?? `Vehicle ${index + 1}`,
  //     icon: { url: '' }, // आइकन Viewer में सेट होगा
  //     params: {
  //       vehicleNo: loc.vname ?? '',
  //       driver: this.vehicleInfo().Driver ?? '',
  //       phoneNo: this.vehicleInfo().DriverMobile ?? '',
  //       dateTime: loc.device_time ?? '',
  //       speed: loc.speed ?? '',
  //       address: '',
  //       // title:'Vehicle Details',
  //     },
  //     markerType: 'tracking', // <-- डेटा का प्रकार बताएँ
  //     isStart: index === 0, // <-- स्टार्ट फ्लैग
  //     isEnd: index === this.locations().length - 1, // <-- एंड फ्लैग
  //   }))
  // );

  // --- अलर्ट मार्कर बनाने का लॉजिक ---
  private alertMarkers = computed<Marker[]>(() =>
    this.alerts()?.map((alert: any, index) => {
      const coords = (alert.geocoord || '0,0').split(',');
      const alertName = alert.trigger
        ? alert.trigger.toString().substring(0, 5) // Limit to 5 characters
        : 'Unknown Alert';
      return {
        position: { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) },
        title: alert.vehicle_name || `Alert ${index + 1}`,
        icon: { url: '', labelOrigin: { x: 19, y: 14 } },
        label: {
          text: alertName || 'ALERT', // API से trigger key का उपयोग करें ,scaledSize: { width: 32, height: 32 },

          fontWeight: '400',
          fontSize: '12px',
          color: 'white',
        },
        params: {
          startDate: alert.run_date,
          endDate: alert.close_date,
          alertName: alert.trigger,
          location: alert.location,
          level: alert.level,
          status: alert.status,
          title: 'Alert Details',
        },
        markerType: 'alert', // <-- डेटा का प्रकार बताएँ
      };
    }),
  );
  private customerMarkers = computed<Marker[]>(() =>
    this.customerData()?.map((item: any, index) => {
      const coords = (item.Coordinates || '0,0').split(',');

      // Label from API (example: M1, M2, ...)
      const pointLabel = item.Label ? item.Label.toString() : `P${index + 1}`;

      return {
        position: {
          lat: parseFloat(coords[0]),
          lng: parseFloat(coords[1]),
        },

        title: item.Source || `Point ${index + 1}`,

        icon: {
          url: '', // Aap custom icon dena chahe to add kar sakte hain
          labelOrigin: { x: 19, y: 16 },
        },

        label: {
          text: pointLabel, // <-- API ka Label direct marker pe show hoga
          fontWeight: 'bold',
          fontSize: '12px',
          color: 'black',
        },

        params: {
          source: item.Source,
          sequenceNo: item.SequenceNo,
          STD: item.STD,
          ATD: item.ATD,
          // sta: item.STA,
          // ata: item.ATA,
          // delayArrival: item.DelayArrival,
          // status: item.Status,
          // radius: item.Radius,
          title: 'Customer Point Details',
        },
        geofence: {
          GeofenceName: item.source,
          Radius: item.Radius, // 500 meters
          Geofence: item.Geofence, // <-- This blank string triggers a CIRCLE
          position: {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1]),
          },
          // 'center' field is NOT required here, it will be set to marker.position
        },
        markerType: 'customer',
      };
    }),
  );

  // private processAndSetData(rawData: any, eve: any): Marker[] {
  //   this.vehicleInfo.set(eve);
  //   this.locations.set(rawData); // locations signal अपडेट हुआ

  //   // markers computed signal अब स्वतः (automatically) अपडेट हो जाएगा
  //   return this.alertMarkers(); // अपडेटेड मार्कर डेटा वापस करें
  // }
  // private processAlertAndSetData(rawData: any): Marker[] {
  //   this.alerts.set(rawData); // locations signal अपडेट हुआ

  //   // markers computed signal अब स्वतः (automatically) अपडेट हो जाएगा
  //   return this.trackingMarkers(); // अपडेटेड मार्कर डेटा वापस करें
  // }
  private processCustomerAndSetData(rawData: any): Marker[] {
    this.customerData.set(rawData.TripDetails); // locations signal अपडेट हुआ
    // markers computed signal अब स्वतः (automatically) अपडेट हो जाएगा
    return this.customerMarkers(); // अपडेटेड मार्कर डेटा वापस करें
  }

  async openMapCallApi(eve: MapTrackingPayload) {
    const opts = eve?.options || {};
    const fetchAlerts = opts.fetchAlerts ?? true; // Default true
    const fetchCustomer = opts.fetchCustomer ?? true; // Default true
    const showTimeline = opts.showTimeline ?? true; // Default true
    const showliveData = eve.liveData ?? {};
    // 1. API कॉल को शुरू करें, लेकिन 'await' न करें।
    const locationDataPromise: Promise<any> =
      this.vehicleTrackingService.fetchVehicleTracking({
        runDate: eve.RnDt,
        imei: eve.Imei,
        timeInterval: '120',
        portal: 'itraceit',
        endDate: eve.CloseDt,
        groupId: '',
        accountId: '',
      });
    // 🛑 3. SMART API CALLS: Agar parent ne false bheja hai, toh API call mat karo! (Saves Server Load)
    const alertDataPromise = fetchAlerts
      ? this.alertProcessedData(eve.ShpNo)
      : Promise.resolve([]); // Dummy empty array if skipped

    let customerLoadingPromise: Promise<any[]> = Promise.resolve([]);
    if (fetchCustomer) {
      const formdata = new FormData();
      formdata.append('MTripId', String(eve.Id));
      customerLoadingPromise = this.apiService
        .getCustomerDetails(formdata)
        .toPromise()
        .then((raw: any) => this.processCustomerAndSetData(raw))
        .catch((err: any) => {
          console.error('Customer API Failed:', err);
          return [];
        });
    }
    // const customerLoadingPromise = customerDataPromise
    //   .then((raw: any) => {
    //     console.log(
    //       'Customer Data Fetched:',
    //       this.processCustomerAndSetData(raw),
    //     );
    //     return this.processCustomerAndSetData(raw);
    //   })
    //   .catch((err: any) => {
    //     console.error('Customer API Failed:', err);
    //     return [];
    //   });
    const modalData: MapModalData = {
      title: opts.title || 'Fleet Vehicle Locations',
      size: opts.size || 'xxl',
      initialData: {
        // ✅ KEY CHANGE: Modal को 'Promise' पास करें, जिसमें processed marker data होगा।
        locationsPromise: locationDataPromise,
        center: this.center(), // डिफ़ॉल्ट सेंटर
        zoom: this.zoom(), // डिफ़ॉल्ट ज़ूम
        drawPolyline: opts.drawPolyline ?? true,
        displayTools: opts.displayTools ?? true,
        iconType: 'tracking',
      },
      alertData: {
        locationsPromise: alertDataPromise,
        iconType: 'alert',
        //  drawPolyline: false,
        //  displayTools:true ,
      },
      customerData: {
        locationsPromise: customerLoadingPromise,
        iconType: 'customer',
      },
      timelineData: showTimeline
        ? {
            from: new Date(eve.RnDt).getTime() || 0,
            imeis: eve.Imei,
            portal: 'itraceit',
            to: new Date(eve.CloseDt).getTime() || 0,
            AccesToken: this.token,
          }
        : undefined, // 👈 Timeline Hide karne ka magic
      liveData: showliveData,
    };

    // 4. Modal को तुरंत खोलें
    try {
      console.log(
        'Opening Map Modal immediately, waiting for promise resolution...',
      );
      const result = await this.modalService.openMapModal(modalData);
      console.log('Modal closed with result:', result);
    } catch (error) {
      console.log('Modal dismissed or failed to open.', error);
    }
  }
  async alertProcessedData(shipment_no: string): Promise<any> {
    const response: any = await this.vehicleTrackingService.fetchVehicleAlert({
      shipment_no: shipment_no,
    });
    console.log('Alert data fetched:', response);
    this.alerts.set(response); // locations signal अपडेट हुआ

    // markers computed signal अब स्वतः (automatically) अपडेट हो जाएगा
    return this.alertMarkers();
  }
}
