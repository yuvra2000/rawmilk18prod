import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { LeciAddFormService } from './leci-add-form.service';
import { leciAddFormFields } from './state-service/config';

@Component({
  selector: 'app-leci-add-form',
  standalone: true,
  imports: [CommonModule, FilterFormComponent],
  templateUrl: './leci-add-form.component.html',
  styleUrl: './leci-add-form.component.scss'
})
export class LeciAddFormComponent implements OnInit {
  private router = inject(Router);
  private leciService = inject(LeciAddFormService);

  formFields = signal(leciAddFormFields());
  formData = signal<any>(null);

  ngOnInit() {
    const state = window.history.state;
    if (state && state.dispatchid) {
      this.loadPreData(state.dispatchid, state.chamber_no);
    }
  }

  loadPreData(dispatchId: string, chamberNo: string) {
    const token = localStorage.getItem('AccessToken') || '30Tk9g51EFw6BX3CGtm983uc290fOj40';
    const payload = createFormData(token, {
      dispatchid: dispatchId,
      chamber_no: chamberNo,
      ForApp: '0'
    });

    this.leciService.getLeciPreData(payload).subscribe({
      next: (res) => {
        if (res?.Status === 'success' && res?.Data) {
          const apiData = res.Data;
          // Mapping API response to form fields
          this.formData.set({
            truckNo: apiData.vehicle_no || apiData.VehicleNo || apiData.vehicle_num,
            compartmentNo: apiData.chamber_no || apiData.chamber || apiData.ChamberNo,
            driverName: apiData.driver_name || apiData.DriverName || apiData.driver,
            lrNo: apiData.LRNumber || apiData.lr_no || apiData.LRNo,
            dispatchDate: apiData.DispatchDate || apiData.dispatch_date,
            supplierCode: apiData.SupplierCode || apiData.supplier_code || apiData.Supplier,
            mccCode: apiData.MccCode || apiData.mcc_code || apiData.Mcc,
            schedulingAgreementNo: apiData.AgreementNo || apiData.scheduling_agreement_no,
            poLineNumber: apiData.PoLineNo || apiData.po_line_number,
            supplierFat: apiData.Fat || apiData.supplier_fat || apiData.FatPercent,
            supplierSnf: apiData.Snf || apiData.supplier_snf || apiData.SnfPercent,
            materialCode: apiData.MaterialCode || apiData.material_code,
            plantCode: apiData.PlantCode || apiData.plant_code || apiData.Plant,
            validityPeriod: apiData.ValidityPeriod || apiData.validity_period,
            secutrackDispatchNo: apiData.ChallanNo || apiData.dispatch_no || apiData.SecutrackDispatchNo,
            quantity103: apiData.Qty || apiData.Qty_103 || apiData.Quantity || apiData.quantity103
          });
        }
      },
      error: (err) => {
        console.error('Error fetching pre-data:', err);
      }
    });
  }

  onFormSubmit(data: any) {
    console.log('Form Submitted:', data);
  }
}
