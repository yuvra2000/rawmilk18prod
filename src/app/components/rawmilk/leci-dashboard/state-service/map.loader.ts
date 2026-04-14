import { computed, inject, Injectable, signal } from '@angular/core';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import { mapApiService } from '../../mapApi.service';
import { VehicleTrackingService } from '../../common.service';
import { MapModalData } from '../../../../shared/components/google-map-viewer/map-modal';
import { firstValueFrom } from 'rxjs';
// import { apiService } from './api.services';

// import { VehicleTrackingService } from '../../../../../../shared/services/vehicle-tracking.service';
// import { UniversalModalService } from '/../../../../../shared/services/universal-modal.service';
// import { MapModalData } from '../../../../../../shared/components/google-map-viewer/map-modal';
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
export interface MapTrackingPayload {
  Id: string | number; // Trip ID (Used as MTripId for Customer details)
  ShpNo: string; // Shipment Number (Used for fetching Alerts)
  imei_no: string; // Device IMEI Number (Used for Vehicle Tracking)
  DispatchDate: string; // Run Date / Start Date (Format expected by API)
  closeDate: string; // Close Date / End Date
  route_id: string;
  // Optional: Agar future me vehicle/driver info dikhani ho (Aapke commented code ke anusar)
  Driver?: string;
  vehicle_no: string;
  DriverMobile?: string;
  [key: string]: any; // Catch-all for extra row data if needed
}
@Injectable({
  providedIn: 'root',
})
export class MapLoader {
  private apiService = inject(mapApiService);
  // private storageService = inject(StorageService)
  locations = signal<Location[]>([]);
  alerts = signal<any[]>([]);
  vehicleInfo = signal<any>({});
  private modalService = inject(UniversalModalService);
  private vehicleTrackingService = inject(VehicleTrackingService);
  // 🗺️ Map Signals
  token: any = localStorage.getItem('AccessToken') || '';
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
        icon: { url: '', labelOrigin: { x: 19, y: 16 } },
        label: {
          text: alertName || 'ALERT', // API से trigger key का उपयोग करें ,scaledSize: { width: 32, height: 32 },

          fontWeight: 'bold',
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

  private getAlertMarkers(eve: any): Promise<any[]> {
    const payload = new FormData();
    payload.append('AccessToken', this.token || '');
    payload.append('DispatchId', eve.id); // 👈 IMPORTANT mapping
    payload.append('ForWeb', '1');

    return firstValueFrom(this.apiService.alertservice(payload))
      .then((res: any) => {
        if (res.Status !== 'success') {
          return [];
        }

        const alertData = res.Data || [];

        // 🔥 CONVERT TO MARKERS (THIS REPLACES plotCustomerMarkers)
        return alertData.map((alert: any, index: number) => {
          const alertName =
            alert.alert_type === 'LID TAMPERING' ||
            alert.alert_type === 'LOCK TAMPERING'
              ? 'LT'
              : alert.alert_type;
          const coords = (alert.geocoord || '0,0').split(',');

          return {
            position: {
              lat: parseFloat(coords[0]),
              lng: parseFloat(coords[1]),
            },
            title: alert.vehicle_name || `Alert ${index + 1}`,

            icon: {
              url: '', // map viewer handles icon
            },

            label: {
              text: alertName || '',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
            },

            // params: {
            //   alertName: alertName,
            //   location: alert.location,
            //   status: alert.status,
            //   startDate: alert.run_date,
            //   endDate: alert.close_date,
            //   Voilation_Time: alert.voilation_time,
            //   title: 'Alert Details',
            // },
            params: {
              alert_type: alertName,
              vehicle_name: alert.vehicle_name,

              // ✅ FIXED KEYS
              start_time: alert.start_time || alert.run_date,
              end_time: alert.end_date, // 👈 YOUR REQUIREMENT

              stoppage_start: alert.stoppage_start,
              stoppage_end: alert.stoppage_end,

              location: alert.location,
              voilation_time: alert.voilation_time,

              title: 'Alert Details',
            },

            markerType: 'alert',
          };
        });
      })
      .catch(() => []);
  }

  private getSourceDestMarkers(eve: any): Promise<any[]> {
    return new Promise((resolve) => {
      const geodata = [
        {
          name: eve.Mcc, // ✅ SOURCE
          geo: eve.mccCoords,
          type: 'S',
        },
        {
          name: eve.Plant, // ✅ DESTINATION
          geo: eve.plantCoords,
          type: 'D',
        },
      ];

      const markers = geodata
        .filter((item) => item.geo)
        .map((item: any) => {
          const [lat, lng] = item.geo.split(',').map(parseFloat);

          return {
            position: { lat, lng },

            title: item.name,

            icon: { url: '' },

            label: {
              text: item.type,
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
            },

            params: {
              name: item.name,
              type: item.type,
              title:
                item.type === 'S' ? 'Source Details' : 'Destination Details',
            },

            markerType: 'customer', // 👈 VERY IMPORTANT
          };
        });

      resolve(markers);
    });
  }

  async openMapCallApi(eve: MapTrackingPayload) {
    // 1. API कॉल को शुरू करें, लेकिन 'await' न करें।
    console.log('MapTrackingPayload', eve);
    if (eve.imei_no == '') {
      return;
    }
    const locationDataPromise: Promise<any> =
      this.vehicleTrackingService.fetchVehicleTracking({
        runDate: eve.DispatchDate,
        imei: eve.imei_no,
        timeInterval: '120',
        // portal: 'itraceit',
        endDate: eve.closeDate,
        route_id: eve.route_id,
        vehicle_no: eve.vehicle_no,
        groupId: '',
        accountId: '',
      });

    const formdata = new FormData();
    // formdata.append('AccessToken',this.token);
    formdata.append('MTripId', String(eve.Id)); // dynamic id from row
    const alertPromise = this.getAlertMarkers(eve);

    const sourceDestPromise = this.getSourceDestMarkers(eve);

    const modalData: MapModalData = {
      title: '',
      size: 'lg',
      initialData: {
        // ✅ KEY CHANGE: Modal को 'Promise' पास करें, जिसमें processed marker data होगा।
        locationsPromise: locationDataPromise,
        center: this.center(), // डिफ़ॉल्ट सेंटर
        zoom: this.zoom(), // डिफ़ॉल्ट ज़ूम
        drawPolyline: true,
        displayTools: true,
        iconType: 'tracking',
      },
      alertData: {
        locationsPromise: alertPromise,
        iconType: 'alert',
      },
      customerData: {
        locationsPromise: sourceDestPromise,
        iconType: 'customer',
      },
      // alertData:{
      //    locationsPromise: locationDataPromise,
      // }
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
}
