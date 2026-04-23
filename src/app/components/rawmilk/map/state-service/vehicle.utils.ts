// src/app/utils/vehicle.utils.ts

import { create } from "lodash-es";
import { createFormData } from "../../../../shared/utils/shared-utility.utils";

export function getVehicleClass(status: string): string {
  const map: Record<string, string> = {
    Active: 'vehicle-active',
    InActive: 'vehicle-inactive',
    NoData: 'vehicle-nodata',
    Breakdown: 'vehicle-breakdown',
    NoGPS: 'vehicle-nogps',
  };
  return map[status] || '';
}

export function getStatusClass(status: string): string {
  if (!status) return 'nodata';

  const s = status.toLowerCase();

  if (s === 'active') return 'active';
  if (s === 'inactive') return 'inactive';
  if (s === 'nodata') return 'nodata';
  if (s === 'breakdown') return 'Breakdown';
  if (s === 'nogps') return 'NoGPS';

  return 'nodata';
}
const token = localStorage.getItem('AccessToken') || '';

export const VehicleFormData = createFormData(token, {

});