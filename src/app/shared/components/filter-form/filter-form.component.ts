import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  Signal,
  input,
  effect,
  computed,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  untracked,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Custom components
import { ActionButtonComponent } from './shared/action-button.component';
import { SearchSelectFieldComponent } from './shared/search-select-field';
import { CascadingSelectFieldComponent } from './shared/cascading-select-field';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { InputFormatDirective } from '../../directives/input-format.directive';
import { SpkFlatpickrComponent } from '../../../@spk/spk-flatpickr copy/spk-flatpickr.component';
import { NgSelectModule } from '@ng-select/ng-select';

// Export types for backward compatibility
export type {
  FieldConfig,
  Option,
  SpkOptions,
  FieldType,
} from './shared/types';
import { FieldConfig, Option, SpkOptions } from './shared/types';
import { ColorSelectFieldComponent } from './shared/color-select-field.component';

/**
 * ✅ Type definition for incoming config
 */
export type FilterFormConfig = {
  title?: string;
  mode?: string;
  fields?: FieldConfig[];
  onSave?: (data: any) => void;
  onControlValueChange?: (
    controlName: string,
    value: any,
    form: FormGroup,
  ) => void;
  showFooter?: boolean;
  buttonName?: string;
  btnClass?: string;
  initialData?: any;
};

/**
 * ✅ Date range validator
 */
export function dateRangeValidator(
  fromFieldName: string,
  toFieldName: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fromDateControl = formGroup.get(fromFieldName);
    const toDateControl = formGroup.get(toFieldName);

    if (
      !fromDateControl ||
      !toDateControl ||
      !fromDateControl.value ||
      !toDateControl.value
    ) {
      return null;
    }

    const fromDate = new Date(fromDateControl.value);
    const toDate = new Date(toDateControl.value);

    return fromDate > toDate ? { dateRange: true } : null;
  };
}

@Component({
  selector: 'filter-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FileUploadComponent,
    InputFormatDirective,
    SpkFlatpickrComponent,
    SearchSelectFieldComponent,
    CascadingSelectFieldComponent,
    ActionButtonComponent,
    ColorSelectFieldComponent,
  ],
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterFormComponent implements OnInit, OnDestroy, OnChanges {
  private fb = inject(FormBuilder);

  // --- Inputs (Standard & Signal mix as per original) ---
  @Input() set fields(value: FieldConfig[]) {
    this._fieldsSignal.set(value || []);
  }
  get fields(): FieldConfig[] {
    return this._fieldsSignal();
  }

  @Input() set dynamicFields(value: FieldConfig[]) {
    this._dynamicFieldsSignal.set(value || []);
  }
  get dynamicFields(): FieldConfig[] {
    return this._dynamicFieldsSignal();
  }

  @Input() btnClass: string = '';
  @Input() allowAutofill: boolean = false;
  @Input() containerClass: string = 'col-lg-2';
  @Input() dependentDataMap: Record<
    string,
    Record<string, Record<string, string>>
  > = {};
  @Input() dependentPairs: Array<{
    categoryField: string;
    typeField: string;
    dataSourceKey: string;
  }> = [];
  @Input() buttonName: string = 'Submit';
  @Input() spkOptions: Signal<SpkOptions> = {} as Signal<SpkOptions>;
  @Input() applyDateRangeValidation: boolean = false;
  @Input() filerFormClass: { [key: string]: string } = {};
  // Signal Inputs
  initialData = input<any | null>(null);

  // --- Outputs ---
  @Output() formSubmit = new EventEmitter<{ [key: string]: any }>();
  @Output() controlValueChange = new EventEmitter<{
    controlName: string;
    value: any;
    form: FormGroup;
  }>();

  // --- Internal State Signals ---
  private _fieldsSignal = signal<FieldConfig[]>([]);
  private _dynamicFieldsSignal = signal<FieldConfig[]>([]);
  private formVersion = signal(0);

  effectiveFieldsSignal = computed(() => {
    const dynamic = this._dynamicFieldsSignal();
    const regular = this._fieldsSignal();
    return dynamic.length > 0 ? dynamic : regular;
  });

  get effectiveFields(): FieldConfig[] {
    return this.effectiveFieldsSignal();
  }

  form: FormGroup = this.fb.group({});
  submitted = false;
  passwordVisibility = signal<Record<string, boolean>>({});

  private destroy$ = new Subject<void>();
  private fromDateFieldName?: string;
  private toDateFieldName?: string;
  private activeSubscriptions = new Set<string>();

  // Signal Input for incoming config
  incomingConfig = input<FilterFormConfig>(
    { onControlValueChange: () => {} },
    { alias: 'incomingConfig' },
  );
  incomingConfigComp = computed(() => {
    console.log('comp ic', this.incomingConfig());
  });

  constructor() {
    this.incomingConfigComp();
    effect(
      () => {
        const config = this.incomingConfig();
        if (config && Object.keys(config).length > 0) {
          if (config.fields) {
            this._dynamicFieldsSignal.set(config.fields);
            this._fieldsSignal.set(config.fields);
            // Trigger form rebuild when fields change
            this.syncFormControls(config.fields);
          }
          if (config.title) {
            // Handle title if needed
          }
          if (config.buttonName) {
            this.buttonName = config.buttonName;
          }
          if (config.btnClass) {
            this.btnClass = config.btnClass;
          }
          if (config.initialData) {
            if (
              config.initialData &&
              this.form &&
              Object.keys(this.form.controls).length > 0
            ) {
              untracked(() => {
                this.populateForm(config.initialData);
              });
            }
          }
        }
      },
      { allowSignalWrites: true },
    );
    /**
     * ✅ OPTIMIZATION: Sync form structure automatically
     */
    effect(
      () => {
        const fields = this.effectiveFieldsSignal();
        if (this.form) {
          this.syncFormControls(fields);
        }
      },
      { allowSignalWrites: true },
    );

    /**
     * ✅ OPTIMIZATION: Handle initial data patching via signal
     */
    effect(
      () => {
        const data = this.initialData();
        if (data && this.form && Object.keys(this.form.controls).length > 0) {
          untracked(() => {
            this.populateForm(data);
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.buildForm();
    this.setupDependentFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['fields'] || changes['dynamicFields']) && this.form) {
      this.updateValidation();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm() {
    const fields = this.effectiveFields;

    if (this.applyDateRangeValidation) {
      this.fromDateFieldName = fields.find((f) => f.dateRole === 'start')?.name;
      this.toDateFieldName = fields.find((f) => f.dateRole === 'end')?.name;
    }

    let formOptions: { validators?: ValidatorFn } = {};
    if (this.fromDateFieldName && this.toDateFieldName) {
      formOptions.validators = dateRangeValidator(
        this.fromDateFieldName,
        this.toDateFieldName,
      );
    }

    this.form = this.fb.group({}, formOptions);
    this.syncFormControls(fields);
  }

  private syncFormControls(fields: FieldConfig[]) {
    // 1. Naye fields ke naamon ki list bana lein
    const newFieldNames = new Set(fields.map((f) => f.name));

    // 2. 🗑️ CLEANUP STEP: Jo controls form mein hain par naye config mein nahi, unhein hata dein
    Object.keys(this.form.controls).forEach((controlName) => {
      if (!newFieldNames.has(controlName)) {
        // Control remove karne se validation error hat jayega
        this.form.removeControl(controlName);
        this.activeSubscriptions.delete(controlName);
      }
    });
    let changed = false;

    fields.forEach((field) => {
      const validators = this.getValidators(field);
      let control = this.form.get(field.name);

      if (!control) {
        this.form.addControl(
          field.name,
          new FormControl(
            { value: null, disabled: field.disabled ?? false },
            validators,
          ),
          { emitEvent: false },
        );
        this.setupValueChangeListener(field.name, field.emitValueChanges);
        changed = true;
      } else {
        // Sync existing control state
        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
        // if (field.disabled !== control.disabled) {
        //   field.disabled ? control.disable({ emitEvent: false }) : control.enable({ emitEvent: false });
        // }
        if (field.disabled) {
          if (control.enabled) control.disable({ emitEvent: false });
        } else {
          if (control.disabled) control.enable({ emitEvent: false });
        }
      }
    });

    if (changed) {
      this.formVersion.update((v) => v + 1);
    }
  }

  private setupValueChangeListener(
    controlName: string,
    shouldEmit: boolean = false,
  ) {
    if (this.activeSubscriptions.has(controlName)) return;

    this.form
      .get(controlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (shouldEmit) {
          this.controlValueChange.emit({ controlName, value, form: this.form });
        }
        // ✅ Also invoke the callback if provided in incomingConfig
        const config = this.incomingConfig();
        if (config?.onControlValueChange) {
          config.onControlValueChange(controlName, value, this.form);
        }
      });

    this.activeSubscriptions.add(controlName);
  }

  private setupDependentFields(): void {
    this.dependentPairs?.forEach((pair) => {
      const catCtrl = this.form.get(pair.categoryField);
      if (catCtrl) {
        catCtrl.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((selectedValue) => {
            this.handleDependentFieldChange(pair, selectedValue);
          });
      }
    });
  }

  private handleDependentFieldChange(
    pair: { categoryField: string; typeField: string; dataSourceKey: string },
    selectedValue: any,
  ): void {
    const selectedItems = !selectedValue
      ? []
      : Array.isArray(selectedValue)
        ? selectedValue
        : [selectedValue];

    if (selectedItems.length === 0) {
      this.updateFieldOptions(pair.typeField, []);
    } else {
      const dataset =
        selectedItems[0][pair.dataSourceKey] ||
        this.dependentDataMap[pair.dataSourceKey] ||
        {};
      const combinedRawOptions = Array.isArray(dataset)
        ? dataset
        : selectedItems.reduce(
            (acc, curr) => ({ ...acc, ...(dataset[curr?.id] || {}) }),
            {},
          );

      this.updateFieldOptions(
        pair.typeField,
        this.createOptions(combinedRawOptions),
      );
    }
    this.form.get(pair.typeField)?.setValue(null);
  }

  private createOptions(data: any): Option[] {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id ?? item.value ?? '',
        name: item.name ?? item.branchname ?? item.title ?? String(item),
      }));
    }
    return Object.entries(data).map(([key, value]: [string, any]) => ({
      id: key,
      name:
        typeof value === 'string'
          ? value
          : (value?.name ?? value?.branchname ?? value?.title ?? String(value)),
    }));
  }

  private updateFieldOptions(fieldName: string, options: Option[]): void {
    const update = (fields: FieldConfig[]) =>
      fields.map((f) =>
        f.name === fieldName ? { ...f, options, loading: false } : f,
      );

    if (this._dynamicFieldsSignal().length > 0) {
      this._dynamicFieldsSignal.update(update);
    } else {
      this._fieldsSignal.update(update);
    }
  }

  // --- PUBLIC API (Critical for Backward Compatibility) ---

  /**
   * ✅ RESTORED: Public method to populate the form
   */
  populateForm(data: any): void {
    if (data && this.form) {
      this.form.patchValue(data);
    }
  }

  /**
   * ✅ RESTORED: Public getter to check form validity
   */
  get isFormValid(): boolean {
    return this.form?.valid ?? false;
  }

  /**
   * ✅ RESTORED: Public method to reset the form
   */
  resetForm(): void {
    this.form.reset();
    this.submitted = false;
  }

  /**
   * ✅ REACTIVE TEMPLATE ACCESSOR
   */
  getFormControl(fieldName: string): FormControl {
    this.formVersion();
    const control = this.form.get(fieldName);
    return (control || new FormControl()) as FormControl;
  }

  getValidators(field: FieldConfig): ValidatorFn[] {
    const validators = [];
    if (field.required) validators.push(Validators.required);
    if (field.minLength) validators.push(Validators.minLength(field.minLength));
    if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
    if (field.pattern) validators.push(Validators.pattern(field.pattern));
    // ✅ NEW: Min Validator Add karein
    if (field.min !== undefined && field.min !== null) {
      validators.push(Validators.min(field.min));
    }
    if (field.max !== undefined && field.max !== null) {
      validators.push(Validators.max(field.max));
    }
    return validators;
  }

  updateValidation(): void {
    this.effectiveFields.forEach((field) => {
      const control = this.form.get(field.name);
      if (control) {
        control.setValidators(this.getValidators(field));
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  hasError(field: FieldConfig): boolean {
    const ctrl = this.form.get(field.name);
    if (!ctrl) return false;
    const hasControlError = ctrl.invalid && (ctrl.touched || this.submitted);

    if (this.toDateFieldName && field.name === this.toDateFieldName) {
      const hasFormError =
        this.form.hasError('dateRange') && (ctrl.touched || this.submitted);
      return hasControlError || hasFormError;
    }

    return hasControlError;
  }

  getErrorMessage(field: FieldConfig): string | null {
    if (
      this.toDateFieldName &&
      field.name === this.toDateFieldName &&
      this.form.hasError('dateRange')
    ) {
      const fromField = this.effectiveFields.find(
        (f) => f.name === this.fromDateFieldName,
      );
      const toField = this.effectiveFields.find(
        (f) => f.name === this.toDateFieldName,
      );
      return `'${toField?.label}' must be after '${fromField?.label}'.`;
    }

    const ctrl = this.form.get(field.name);
    if (ctrl?.errors) {
      if (ctrl.errors['required']) return `${field.label} is required.`;
      if (ctrl.errors['minlength']) return `Min length: ${field.minLength}.`;
      if (ctrl.errors['pattern']) return `Invalid format.`;
      // ✅ NEW: Min Error Message Add karein
      if (ctrl.errors['min']) {
        return `Quantity must be at least ${ctrl.errors['min'].min}.`;
      }
      if (ctrl.errors['max']) {
        return `Quantity must be at most ${ctrl.errors['max'].max}.`;
      }

      return 'Invalid value.';
    }
    return null;
  }

  getActionContext(fieldName: string) {
    return {
      fieldName: fieldName,
      formData: this.form?.getRawValue(),
      form: this.form,
    };
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.getRawValue();

    const config = this.incomingConfig();
    if (config?.onSave) {
      config.onSave(formData);
    }
    this.formSubmit.emit(this.form.getRawValue());
  }

  togglePasswordVisibility(fieldName: string): void {
    this.passwordVisibility.update((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }

  getProfileUrl(fieldName: string): string {
    const val = this.form.get(fieldName)?.value;
    return typeof val === 'string' ? val : '';
  }

  computeDateConstraint(offset?: number, type: string = 'date'): string {
    if (offset === undefined || offset === null) return '';

    const date = new Date();

    if (type === 'month') {
      // 1. Pehle date ko mahine ki 1st tarikh par set karo (Overflow se bachne ke liye)
      date.setDate(1);

      // 2. Ab offset apply karo.
      // Agar offset -1 hai, toh ye current month (March) se February par jayega.
      date.setMonth(date.getMonth() + offset);

      // 3. Ab is mahine ki aakhri date par le jao
      // Hum agle mahine ki 0th date par jayenge jo current ki last date hoti hai
      date.setMonth(date.getMonth() + 1, 0);
    } else {
      // Normal date logic
      date.setDate(date.getDate() + offset);
    }

    // 🚨 Safety Check: RangeError se bachne ke liye
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  }
}
