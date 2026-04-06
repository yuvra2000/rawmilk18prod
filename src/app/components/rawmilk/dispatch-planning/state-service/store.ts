import { computed, inject, signal } from '@angular/core';
import { FieldConfig } from '../../../../shared/components/filter-form/filter-form.component';
import { filterfields, masterFilterParams, tankerFilterParams } from './config';
import { firstValueFrom } from 'rxjs';
import { DispatchPlanningService } from '../dispatch-planning.service';
import { AlertService } from '../../../../shared/services/alert.service';
import {
  createFormData,
  GroupId,
  handleApiError,
  handleApiResponse,
  handleSessionExpiry,
  supplier_id,
  token,
} from '../../../../shared/utils/shared-utility.utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
export interface InitialData {
  milkList?: any[];
  tankerList?: any[];
  destinationList?: any[];
}
export class DispatchPlanningStore {
  private dispatchPlanningService = inject(DispatchPlanningService);
  private alertService = inject(AlertService);
  private spinnerService = inject(NgxSpinnerService);
  private toastService = inject(ToastrService);
  filterfields = computed<any[]>(() =>
    filterfields(
      this.initialData().milkList,
      this.initialData().tankerList,
      this.initialData().destinationList,
    ),
  );
  initialData = signal<InitialData>({
    milkList: [],
    tankerList: [],
    destinationList: [],
  });
  constructor() {
    console.log('DispatchPlanningStore initialized', filterfields());
  }
  async loadInitialData() {
    this.spinnerService.show();
    try {
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.initializePageData(
          masterFilterParams,
          tankerFilterParams,
        ),
      );
      this.initialData.set({
        milkList: res.masterOptions.Milk || [],
        tankerList:
          res.tankerFilter.Data?.map((t: any) => ({
            ...t,
            id: t.VehicleNo,
            name: t.VehicleNo,
          })) || [],
        destinationList:
          res.masterOptions.PlantSupplier.filter((ps: any) => ps.type == '3') ||
          [],
      });
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.alertService.error('Error loading initial data');
    } finally {
      this.spinnerService.hide();
    }
  }
  async onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
    console.log('Destination list', this.initialData().destinationList);
    const rows = data.dispatchDetails || [];
    const productiondata = rows.map((row: any) => ({
      vehicleno: row.tanker || null,
      milktype:
        this.initialData().milkList &&
        this.initialData().milkList?.find((d) => d.id === row.milk)?.code,
      destination:
        this.initialData().destinationList &&
        this.initialData().destinationList?.find(
          (d) => d.id === row.destination,
        )?.code,
      quantity: row.quantity || null,
      transit_status: row.status || null,
      arivaldate: row.arrival_date || null,
      arivaltime: row.arrival_time || null,
    }));
    let formdata = createFormData(token, {
      GroupId,
      ForApp: '0',
      supplier_code: supplier_id,
      productionData: JSON.stringify(productiondata),
    });
    try {
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.submitDispatchPlan(formdata),
      );
      handleApiResponse(
        res,
        this.toastService,
        undefined,
        res.message,
        res.Message,
      );
      handleSessionExpiry(res, this.alertService);
    } catch (error) {
      this.alertService.error('Error submitting form');
    }
  }
  formData = signal<any>({
    dispatchDetails: [],
  });

  private resolveTankerId(tankerCode: string): string | null {
    if (!tankerCode) return null;
    const tanker = this.initialData().tankerList?.find((item: any) => {
      // debugger;
      return item.VehicleNo === tankerCode || item.id === tankerCode;
    });
    return tanker?.id ?? tankerCode;
  }
  private resolveMilkId(milkCode: string): string | null {
    if (!milkCode) return null;
    const milk = this.initialData().milkList?.find(
      (item: any) => item.code === milkCode || item.id === milkCode,
    );
    return milk?.id ?? milkCode;
  }

  private resolveDestinationId(destinationCode: string): string | null {
    if (!destinationCode) return null;
    const destination = this.initialData().destinationList?.find(
      (item: any) =>
        item.code === destinationCode || item.id === destinationCode,
    );
    return destination?.id ?? destinationCode;
  }

  async uploadExcelFile(event: any): Promise<any[]> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return [];
    }

    const formData = createFormData(token, {
      GroupId,
      ForApp: '0',
      file: file,
    });
    this.spinnerService.show();
    try {
      const res: any = await firstValueFrom(
        this.dispatchPlanningService.uploadDispatchExcel(formData),
      );
      handleSessionExpiry(res, this.alertService);
      if (!handleApiResponse(res, this.toastService)) {
        return [];
      }
      const mappedRows = (res.Data || res.data || []).map((item: any) => ({
        tanker: this.resolveTankerId(item['Tanker No.']) || null,
        milk: this.resolveMilkId(item['Milk Code'] || ''),
        arrival_date: item['Arrival Date at Plant'] || null,
        arrival_time: (item['Tentative Arrival Time at Plant'] || '').slice(
          0,
          5,
        ),
        quantity: item['Quantity'] || null,
        status: item['Tanker Status'] || null,
        destination: this.resolveDestinationId(item['Destination Code'] || ''),
      }));

      this.formData.set({
        dispatchDetails: mappedRows,
      });
      return mappedRows;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      this.spinnerService.hide();
    }
  }
}
