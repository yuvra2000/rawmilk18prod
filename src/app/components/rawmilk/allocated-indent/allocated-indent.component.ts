import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AllocatedIndentService } from './allocated-indent.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var pako: any;

@Component({
  selector: 'app-allocated-indent',
  templateUrl: './allocated-indent.component.html',
  styleUrls: ['./allocated-indent.component.scss'],
  standalone: true,
  imports: [NgSelectComponent, FormsModule, ReactiveFormsModule, CommonModule],
  providers: [DatePipe],
})
export class AllocatedIndentComponent implements OnInit {
  token: any;
  supp_id: any;
  groupId: any;
  datetimepicker1: any;
  currentDateTime: any;
  indentList: any = [];
  id: any;
  quantity: any;
  remarks: any;
  min: any;
  usertype: any;
  form: FormGroup;
  master: any = [];
  remainingQuantity: any = '';
  demandQuantity: any = '';
  vewidata: any = [];

  allocationdata: any = [];
  payloadsData: any;
  readOnlyFields: { [key: number]: boolean } = {};
  constructor(
    private router: Router,
    private allocatedIntentService: AllocatedIndentService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private location: Location,
    private toast: ToastrService,
  ) {
    this.form = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });
    this.allocationdata = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    if (this.allocationdata == undefined) {
      this.location.back();
    }
    console.log('allocationdata', this.allocationdata);
    this.demandQuantity = this.allocationdata?.structuredata?.quan;
    this.remainingQuantity = this.demandQuantity;
    this.token = localStorage.getItem('AccessToken')!;
    this.supp_id = localStorage.getItem('supplier_id')!;
    this.usertype = localStorage.getItem('usertype')!;
    this.groupId = localStorage.getItem('GroupId')!;
    let TocurrentDateTime = new Date();
    TocurrentDateTime.setDate(TocurrentDateTime.getDate());
    let formattedDate2 = TocurrentDateTime.toISOString().split('T')[0];
    this.datetimepicker1 = this.datepipe.transform(
      formattedDate2,
      'yyyy-MM-dd',
    );
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7); // set date 7 days back
    let formattedDate = currentDate.toISOString().split('T')[0];
    this.currentDateTime = this.datepipe.transform(formattedDate, 'yyyy-MM-dd');

    this.form.valueChanges.subscribe(() => {
      this.updateRemainingQuantity();
    });

    this.filterS();
  }
  fetchmccdetails() {
    let id = this.allocationdata?.structuredata?.Id;
    var formdata = createFormData(this.token, {
      GroupId: this.groupId,
      UserType: this.usertype,
      SubRole: '',
      IndentId: id,
      ForWeb: '1',
    });

    this.allocatedIntentService.viewAllocate(formdata).subscribe((res: any) => {
      if (res.Status === 'success') {
        this.clearRows();
        this.payloadsData = [];
        let subIndentData = res?.Allocation.filter(
          (item: any) => item.Type == 'SubIndent',
        );

        if (subIndentData.length == 0) {
          this.addRow();
        } else {
          subIndentData.forEach((allocation: any, index: number) => {
            this.payloadsData.push(allocation);
            console.log('allocation', this.master, allocation);
            debugger;
            const matchedItem = this.master.find(
              (item: any) => item.code === allocation.MCCCode,
            );

            if (matchedItem) {
              const newRow = this.fb.group({
                mcc: [matchedItem], // Prefilled mcc value
                quantity: [allocation.Quantity],
                index: [index], // Assign index
                id: [allocation.id],
                isPrefilled: [true], // Mark row as prefilled
              });

              newRow.get('mcc')?.disable();
              (this.form.get('rows') as FormArray).push(newRow);
              console.log('Rows', this.form.get('rows')?.value);
              this.updateRemainingQuantity();
            }
          });
        }
      } else {
        this.sessionCheck(res);
      }
    });
  }

  clearRows() {
    const formArray = this.form.get('rows') as FormArray;
    formArray.clear();
  }

  filterS() {
    this.master = [];
    const formData = createFormData(this.token, {
      GroupId: this.groupId,
      supplier_id: this.supp_id,
      ForApp: '0',
    });

    this.allocatedIntentService.getMCCData(formData).subscribe((res: any) => {
      this.sessionCheck(res);
      this.master = res?.Data;
      if (this.allocationdata?.structuredata?.status == 'Edit')
        this.fetchmccdetails();
    });
  }

  createRow(): FormGroup {
    return this.fb.group({
      mcc: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.min(1), // Ensure quantity is at least 1
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }
  addRow(): FormGroup {
    const rows = this.form.get('rows') as FormArray;
    const newRow = this.createRow();
    rows.push(newRow);

    return newRow; // Return the newly created row
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  removeRow(index: number) {
    const rows = this.form.get('rows') as FormArray;
    rows.removeAt(index);
  }

  deletePrefilledRow(id: number, index: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Entry?',
    );
    if (confirmed) {
      const formdata = createFormData(this.token, {
        id: id.toString(),
      });
      this.toast.success('Entry deleted successfully');
      this.removeRow(index);
      this.allocatedIntentService
        .deleteSubIndent(formdata)
        .subscribe((res: any) => {
          if (res.Status == 'success') {
            this.toast.success('Entry deleted successfully');
            this.removeRow(index);
          } else {
            this.toast.error(res?.Message || 'Failed to delete entry');
          }
        });
    }
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error(
        'Please fill out all required fields correctly before submitting or remove extra fields',
      );
      return;
    }

    const invalidQuantity = this.form.value.rows.some(
      (row: any) => row.quantity === 0,
    );
    if (invalidQuantity) {
      this.toast.error('Quantity cannot be zero.');
      return;
    }
    if (this.allocationdata?.structuredata?.status === 'Edit') {
      const splitIndent = {
        id: this.allocationdata?.structuredata?.Id, // Dynamic id
        data: this.form.value.rows
          .filter((row: any) => row.quantity)
          .map((row: any, index: number) => {
            const payload = this.payloadsData[row?.index];

            let dispatchCreated = '';
            if (!row.mcc) {
              // Check if RemainingQuantity is less than Quantity
              if (+payload?.RemaingQuantity < +payload?.Quantity) {
                dispatchCreated = (
                  +payload.Quantity - +payload.RemaingQuantity
                ).toString();
              }
            }

            return {
              id: !row.mcc ? payload?.id : '',
              mcc_id: !row.mcc
                ? payload?.mcc_id ||
                  this.master.find(
                    (item: any) => item.code === payload?.MCCCode,
                  )?.mcc_id
                : row.mcc.mcc_id,
              mcc_code: !row.mcc ? payload?.MCCCode : row.mcc.code,
              mcc_name: !row.mcc ? payload?.MCCName : row.mcc.name,
              dispatch_created: row.mcc ? '' : dispatchCreated, // Apply the condition here
              quantity: row.quantity.toString(), // Ensure quantity is always a string
            };
          }),
      };

      console.log('edit2', splitIndent); // Check the filtered and formatted SplitIndent data
      // return;

      // return
      // Prepare formdata for API call
      var formdata = createFormData(this.token, {
        SplitIndent: JSON.stringify(splitIndent),
        GroupId: this.groupId,
        UserType: this.usertype,
        SubRole: '1',
        ForWeb: '1',
      });
      this.allocatedIntentService
        .editAllocate(formdata)
        .subscribe((res: any) => {
          console.log('res', res);
          if (res.Status == 'success') {
            this.toast.success('Entry updated successfully');
            // this.SpinnerService.hide();
            this.location.back();
          } else if (res.Status == 'fail') {
            this.toast.error(res?.Message || 'Failed to update entry');
            // this.SpinnerService.hide();
          }
        });
    }
    if (this.allocationdata?.structuredata?.status === 'New') {
      const splitIndent = {
        id: this.allocationdata?.structuredata?.Id, // This would be your dynamic id
        data: this.form.value.rows.map((row: any) => ({
          mcc_id: row.mcc.mcc_id, // Extract the mcc ID
          mcc_code: row.mcc.code, // Extract the mcc Code
          mcc_name: row.mcc.name, // Extract the mcc Name
          quantity: row.quantity.toString(), // Extract the quantity as string
        })),
      };
      var formdata = createFormData(this.token, {
        SplitIndent: JSON.stringify(splitIndent),
        GroupId: this.groupId,
        UserType: this.usertype,
        SubRole: '1',
        ForWeb: '1',
      });

      this.allocatedIntentService.Allocate(formdata).subscribe((res: any) => {
        if (res.Status == 'success') {
          this.toast.success(res?.Messsage || 'Entry created successfully');
          this.location.back();
        } else if (res.Status == 'fail') {
          this.toast.error(res?.Message || 'Failed to create entry');
        }
      });
    }
  }
  get rows() {
    return this.form.get('rows') as FormArray;
  }
  updateRemainingQuantity() {
    let totalAllocated = this.rows.controls
      .map((row) => row.get('quantity')?.value || 0)
      .reduce((acc, val) => acc + Number(val), 0);

    // Ensure remaining quantity is updated correctly
    this.remainingQuantity = this.demandQuantity - totalAllocated;
    this.rows.controls.forEach((row) => {
      const quantityControl = row.get('quantity');
      if (quantityControl) {
        quantityControl.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(
            this.remainingQuantity + Number(quantityControl.value),
          ),
        ]);
        quantityControl.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
  sessionCheck(res: any) {
    if (
      res?.Message == 'Sorry! Session expired, Please login again ..!' ||
      res?.Result == 'Session Expired due to new login.'
    ) {
      this.toast.error(res?.Message || 'Session expired. Please login again.');
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
