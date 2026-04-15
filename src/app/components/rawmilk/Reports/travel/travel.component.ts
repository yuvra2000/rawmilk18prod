import { Component, OnInit, signal, inject, computed } from '@angular/core';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  Distacefeilds,
  DistanceGrid,
  travelfeilds,
} from '../state-service/config';
import { MasterStore } from '../state-service/masterstore.service';
import { vehicleFormData } from '../state-service/utils';
import { SharedModule } from '../../../../shared/shared.module';
import { CollapseWrapperComponent } from '../../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
  handleSessionExpiry,
} from '../../../../shared/utils/shared-utility.utils';
import { ReportService } from '../state-service/report.service';
import { AlertService } from '../../../../shared/services/alert.service';
import {
  GridConfig,
  AdvancedGridComponent,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

import {
  travelStandardGrid,
  travelDetailedGrid,
} from '../state-service/config';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';

@Component({
  selector: 'app-travel',
  standalone: true,
  templateUrl: './travel.component.html',
  styleUrl: './travel.component.scss',
  imports: [
    SharedModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
})
export class TravelComponent {
  private store = inject(MasterStore);
  private reportservice = inject(ReportService);
  private toastService = inject(AlertService);
  detailedData: any = {};
  triprowdata = signal<any[]>([]);
  selectedReport: string = '';
  modal: any;
  addressCache: { [key: string]: string } = {};
  private modalService = inject(UniversalModalService);
  vehicles = computed(() => this.store.state().vehicleOptions);

  filterfields = computed<FieldConfig[]>(() => {
    const vehicles = this.vehicles();

    return travelfeilds.map((field) => {
      if (field.name === 'Vehicle') {
        return {
          ...field,
          options: vehicles as any,
        };
      }
      return field;
    });
  });

  travelConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [],
  });

  ngOnInit(): void {
    this.store.loadInitialData(vehicleFormData);
  }

  // 🔥 SWITCH COLUMNS
  updateColumns(type: string) {
    // debugger;
    this.travelConfig.update((config) => ({
      ...config,
      columns:
        type === 'Standard' ? [...travelStandardGrid] : [...travelDetailedGrid],
    }));
  }

  // 🔥 FORM SUBMIT
  onFormSubmit(value: any) {
    // debugger;
    const token = localStorage.getItem('AccessToken') || '';

    this.selectedReport = value.Report.value;
    this.updateColumns(this.selectedReport);

    const vehicles = Array.isArray(value.Vehicle)
      ? value.Vehicle
      : [value.Vehicle];

    const imeis = vehicles
      ?.map((v: any) => v?.ImeiNo)
      .filter((i: string) => i && i !== 'N/A')
      .join(',');

    const formatDate = (date: string) => {
      const d = new Date(date);
      const pad = (n: number) => n.toString().padStart(2, '0');

      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate(),
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const payload = createFormData(token, {
      imeis,
      from: formatDate(value.from),
      to: formatDate(value.to),
      threshold: 0,
    });

    this.traveldata(payload);
  }

  // 🔥 API CALL
  traveldata(payload: any) {
    this.reportservice.travelData(payload).subscribe({
      next: (res: any) => {
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;

        const success = handleApiResponse(res, this.toastService);

        if (success) {
          const standard = res?.Data?.standard || [];
          const detailedObj = res?.Data?.detailed || {};
          this.detailedData = detailedObj;
          const hasStandard = Array.isArray(standard) && standard.length > 0;
          const hasDetailed =
            detailedObj && Object.keys(detailedObj).length > 0;

          if (!hasStandard && !hasDetailed) {
            this.toastService.warning('Data not available');
            return;
          }
          // debugger;
          if (this.selectedReport == 'Standard') {
            // alert('Standard hit'); // ✅ will now trigger

            this.triprowdata.set(standard);
            // this.detailedData=detailedObj
          } else {
            // convert object → array
            const detailedArray = Object.values(detailedObj).flatMap(
              (v: any) => v.Report || [],
            );

            this.triprowdata.set(detailedArray);
          }
        }
      },
      error: (err) => handleApiError(err, this.toastService),
    });
  }

  // 🔥 ACTION CLICK
  find_detailreport(vehicle: string) {
    console.log('Clicked:', vehicle);
    const vehicleData = this.detailedData?.[vehicle]?.Report || [];
    this.modal = this.modalService.openGridModal({
      title: 'Alert Details',
      columns: [...travelDetailedGrid], // ✅ from config.ts
      rowData: vehicleData,
      size: 'xl',
      context: {
        componentParent: this,
      },
    });
  }

  findAddress11(latlong: string, trip: any): void {
    const token = localStorage.getItem('AccessToken') || '';

    // 🔥 prevent duplicate calls
    if (this.addressCache[latlong]) {
      this.setAddressToRow(latlong, trip, this.addressCache[latlong]);
      return;
    }

    // 🔥 prevent multiple hover hits
    if (trip._loading) return;
    trip._loading = true;

    // optional loading text
    if (latlong === trip.startCoords) {
      trip.startLocation = 'Loading...';
    } else if (latlong === trip.endCoords) {
      trip.endLocation = 'Loading...';
    }

    const payload = createFormData(token, {
      VehicleId: trip.vehicle_id || '',
      ImeiNo: trip.imei_no || '',
      LatLong: latlong,
    });

    this.reportservice.addressS1(payload).subscribe({
      next: (res: any) => {
        trip._loading = false;

        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;

        const success = handleApiResponse(res, this.toastService);
        if (!success) return;

        const address = res?.Data?.Address || 'Address not found';

        // ✅ cache
        this.addressCache[latlong] = address;

        // ✅ update row
        this.setAddressToRow(latlong, trip, address);
      },

      error: (err) => {
        trip._loading = false;

        handleApiError(err, this.toastService);

        const address = 'Address not found';
        this.addressCache[latlong] = address;

        this.setAddressToRow(latlong, trip, address);
      },
    });
  }

  setAddressToRow(latlong: string, trip: any, address: string) {
    if (latlong === trip.startCoords) {
      trip.startLocation = address;
    } else if (latlong === trip.endCoords) {
      trip.endLocation = address;
    }

    // 🔥 force UI update
    this.triprowdata.update((data) => [...data]);
  }
}
