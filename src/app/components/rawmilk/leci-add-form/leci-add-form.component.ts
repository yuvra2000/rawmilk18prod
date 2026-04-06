import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterFormComponent } from '../../../shared/components/filter-form/filter-form.component';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { LeciAddFormService } from './leci-add-form.service';
import { leciAddFormFields } from './state-service/config';
import { AlertService } from '../../../shared/services/alert.service';

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
  private alertService = inject(AlertService);

  dispatchId: string = '';
  chamberNo: string = '';
  supplierName: string = '';
  milkName: string = '';

  formFields = signal(leciAddFormFields());
  formData = signal<any>({
    clotOnBoiling: 'NEG',
    alcoholTest: 'NEG',
    neutralizerRaTest: 'NEG',
    ureaTest: 'NEG',
    ammoniaCompound: 'NEG',
    starchCerealFlourTest: 'NEG',
    saltTest: 'NEG',
    sugarTest: 'NEG',
    glucoseTest: 'NEG',
    maltodextrinTest: 'NEG',
    detergentTest: 'NEG',
    formalinTest: 'NEG',
    hydrogenPeroxideTest: 'NEG',
    addedSmpTest: 'NEG',
    nitrateCompound: 'NEG',
    boricAcid: 'NEG',
  });

  ngOnInit() {
    const state = window.history.state;
    if (state && state.dispatchid) {
      this.dispatchId = state.dispatchid;
      this.chamberNo = state.chamber_no;
      this.loadPreData(this.dispatchId, this.chamberNo);
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
          const invoice = apiData.invoiceData?.[0] || {};
          const leci = apiData.leciData?.[0] || {};

          // Mapping API response to form fields based on provided JSON structure
          this.formData.set({
            ...this.formData(), // Preserve defaults
            truckNo: invoice.vehicle_no,
            compartmentNo: chamberNo,
            driverName: invoice.driver_name,
            lrNo: invoice.lr_no,
            dispatchDate: invoice.dispatch_date,
            supplierCode: invoice.supplier_code,
            mccCode: invoice.mcc_code,
            schedulingAgreementNo: leci.purchasingDocument,
            poLineNumber: leci.item_number,
            supplierFat: invoice.fat_percent,
            supplierSnf: invoice.snf_percent,
            materialCode: leci.milkMaterial,
            plantCode: invoice.plant_code,
            validityPeriod: leci.validityPeriodStart && leci.validityPeriodEnd
              ? `${leci.validityPeriodStart} - ${leci.validityPeriodEnd}`
              : (leci.validityPeriodStart || ''),
            secutrackDispatchNo: invoice.dispatch_no,
            quantity103: invoice.quantity
          });

          this.supplierName = invoice.supplier_name || '';
          this.milkName = leci.milk_name || '';
        }
      },
      error: (err) => {
        console.error('Error fetching pre-data:', err);
      }
    });
  }

  onControlValueChange(event: any) {
    const { controlName, form } = event;
    if (['fatPercent', 'snfPercent', 'proteinPercent'].includes(controlName)) {
      this.calculateCalculatedFields(form);
    }
  }

  calculateCalculatedFields(form: any) {
    const fatVal = form.get('fatPercent')?.value;
    const snfVal = form.get('snfPercent')?.value;
    const proteinVal = form.get('proteinPercent')?.value;

    const fat = parseFloat(fatVal) || 0;
    const snf = parseFloat(snfVal) || 0;
    const protein = parseFloat(proteinVal) || 0;

    // 1. Calculate Total Solids % = Fat % + SNF %
    const totalSolids = fat + snf;
    form.get('totalSolidsPercent')?.setValue(totalSolids > 0 ? totalSolids.toFixed(2) : '', { emitEvent: false });

    // 2. Calculate Protein % on SNF basis = (Protein % / SNF %) * 100
    if (snf !== 0) {
      const proteinOnSnf = (protein / snf) * 100;
      form.get('proteinOnSnfBasis')?.setValue(proteinOnSnf.toFixed(2), { emitEvent: false });
    } else {
      form.get('proteinOnSnfBasis')?.setValue('', { emitEvent: false });
    }
  }

  onFormSubmit(data: any) {
    const leciDataObj = {
      truck_no: data.truckNo,
      compartment_no: Number(data.compartmentNo) || 0,
      driver_name: data.driverName,
      lr_no: data.lrNo,
      Disp_date: data.dispatchDate,
      supp_code: data.supplierCode,
      bmc_mcc_code: data.mccCode,
      scheduling_agreement_no: data.schedulingAgreementNo,
      po_line_number: data.poLineNumber,
      supplier_fat: data.supplierFat,
      supplier_snf: data.supplierSnf,
      material_code: data.materialCode,
      plant_code: data.plantCode,
      validity_period: data.validityPeriod,
      secutrack_dispatch_no: data.secutrackDispatchNo,
      quantity: Number(data.quantity103) || 0,
      check_in_date: data.checkInDate,
      check_in_time: data.checkInTime,
      check_point_number: data.checkPointNumber,
      document_date: data.documentDate,
      posting_date: data.postingDate,
      net_quantity_received: Number(data.netQuantityReceived) || 0,
      seal: data.seal,
      cleanliness: data.cleanliness,
      temperature_c: Number(data.temperature) || 0,
      organoleptic_evaluation: data.organolepticEvaluation,
      foreign_matter: data.foreignMatter,
      titrable_acidity: data.titrableAcidity,
      methylene_blue_reduction_time_test: Number(data.methyleneBrtTest) || 0,
      clot_on_boiling: data.clotOnBoiling,
      alcohol_test: data.alcoholTest,
      neutralizer_test: data.neutralizerRaTest,
      urea_test: data.ureaTest,
      ammonia_compound: data.ammoniaCompound,
      starch_cereal_flour_test: data.starchCerealFlourTest,
      salt_test: data.saltTest,
      sugar_test: data.sugarTest,
      glucose_test: data.glucoseTest,
      maltodextrin_test: data.maltodextrinTest,
      sodium_ion_ppm: data.sodiumIonPpm,
      reichert_meissle_rm_value: data.reichertMeissleValue,
      butyro_refractometer_br_40c: data.brAt40C,
      detergent_test: data.detergentTest,
      formalin_test: data.formalinTest,
      hydrogen_peroxide_test: data.hydrogenPeroxideTest,
      added_smp_test: data.addedSmpTest,
      fat_percent: data.fatPercent,
      protein_percent: data.proteinPercent,
      snf_percent: data.snfPercent,
      total_solids_percent: data.totalSolidsPercent,
      protein_percent_snf_basis: data.proteinOnSnfBasis,
      usage_decision_code: data.usageDecisionCode,
      qa32_qnty: data.qa32Qnty,
      storage_location: data.storageLocation,
      appearance: data.appearance,
      nitrate_compound: data.nitrateCompound,
      boric_acid: data.boricAcid,
      elisa_test: data.elisaTest,
      remarks: data.remarks,
      supplier_name: this.supplierName,
      milk_name: this.milkName
    };

    const token = localStorage.getItem('AccessToken') || '30M50N0yE0077G6j2m6sXW1ndQh8t640';
    const payload = createFormData(token, {
      leciData: JSON.stringify(leciDataObj),
      ForApp: '0',
      chamber_no: this.chamberNo,
      dispatchId: this.dispatchId
    });

    this.leciService.saveLeciData(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'success') {
          this.alertService.success(res.Message || 'LECI data saved successfully');
          this.router.navigate(['/leci-dashboard']);
        } else {
          this.alertService.error(res?.Message || 'Failed to save LECI data');
        }
      },
      error: (err: any) => {
        console.error('Error saving LECI data:', err);
        this.alertService.error('An error occurred while saving LECI data');
      }
    });
  }
}
