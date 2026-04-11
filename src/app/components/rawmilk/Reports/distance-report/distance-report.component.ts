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
  selector: 'app-distance-report',
  standalone: true,
  imports: [
    SharedModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './distance-report.component.html',
  styleUrl: './distance-report.component.scss',
})
export class DistanceReportComponent implements OnInit {
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
  vehicleWiseData = signal<any>({});
  objectKeys = Object.keys;
  filterfields = computed<FieldConfig[]>(() => {
    const vehicles = this.vehicles();

    return Distacefeilds.map((field) => {
      if (field.name === 'Vehicle') {
        return {
          ...field,
          options: vehicles as any,
        };
      }
      return field;
    });
  });

  distanceConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [],
  });

  ngOnInit(): void {
    this.store.loadInitialData(vehicleFormData);
    this.updateColumns();
  }

  // 🔥 SWITCH COLUMNS
  updateColumns() {
    // debugger;
    this.distanceConfig.update((config) => ({
      ...config,
      columns: DistanceGrid,
    }));
  }

  // 🔥 FORM SUBMIT
  onFormSubmit(value: any) {
    // debugger;
    const token = localStorage.getItem('AccessToken') || '';

    // this.selectedReport = value.Report.value;
    // this.updateColumns(this.selectedReport);

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

  traveldata(payload: any) {
    this.reportservice.Distancereport(payload).subscribe({
      next: (res: any) => {
        const sessionExp = handleSessionExpiry(res, this.toastService);
        if (sessionExp) return;

        const success = handleApiResponse(res, this.toastService);
        if (!success) return;

        // 🔥 same structure as old code
        this.vehicleWiseData.set(res?.Data || {});
      },
      error: (err) => handleApiError(err, this.toastService),
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
