import {
  Input,
  Component,
  signal,
  OnInit,
  inject,
  viewChild,
  ViewChild,
  computed,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { forkJoin } from 'rxjs';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { DispatchService } from '../dispatch.service';
import { masterFormData, VehicleFormData } from '../state-service/utils';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
} from '../../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-chamber-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './chamber-details.component.html',
  styleUrl: './chamber-details.component.scss',
})
export class ChamberDetailsComponent {
  @Input() rows!: FormArray;
  private masterservice = inject(DispatchService);
  private toastService = inject(AlertService);
  state = signal({
    milkList: [],
    plantList: [],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // ✅ Ensure at least one row exists
    if (this.rows.length === 0) {
      this.addRow();
    }
    this.loadinitialData();
  }
  addRow() {
    this.rows.push(this.createRow());
  }

  // ✅ Create Row FormGroup
  createRow(): FormGroup {
    return this.fb.group({
      chamber_no: ['', Validators.required],
      milkType: ['', Validators.required],
      temperature: ['', Validators.required],
      quantity: ['', Validators.required],
      fat: ['', Validators.required],
      snf: ['', Validators.required],
      mbrt: ['', Validators.required],
      file: [null],
    });
  }

  // ✅ Remove Row
  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  // ✅ File Handler
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.rows.at(index).patchValue({ file });
  }

  getFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  async loadinitialData() {
    try {
      forkJoin({
        masterData:
          this.masterservice.getCreateIndentDataMilkAndPlantSupplier(
            masterFormData,
          ),
        // vehicledata: this.masterservice.getVehicleData(VehicleFormData),
      })
        .pipe(
          catchError((error) => {
            handleApiError(
              error,
              this.toastService,
              'An error occurred while loading indent data',
            );
            return of({
              masterData: { Milk: [], PlantSupplier: [] },
              vehicledata: { Data: [], TransporterList: [] },
            });
          }),
        )
        .subscribe((result: any) => {
          const filteredPlantList =
            result?.masterData?.PlantSupplier?.filter(
              (plant: any) => plant.type === 3,
            ) || [];

          this.state.update((state) => ({
            ...state,
            milkList: result?.masterData?.Milk || [],
            plantList: filteredPlantList,
          }));
          console.log('Milk List:', this.state().milkList);
          console.log('Plant List:', this.state().plantList);
        });
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        'An error occurred while loading indent data',
      );
    }
  }
}
