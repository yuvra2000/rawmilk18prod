import {
  Component,
  signal,
  OnInit,
  inject,
  viewChild,
  ViewChild,
  computed,
} from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import {
  actionColumn,
  addIntentFields,
  closeIntentField,
  editFields,
  uploadIntentFields,
  viewIndentFilterFields,
  viewIndentGridColumns,
} from './state-service/config';
import {
  formData,
  getMccOptionsForSupplier,
  masterFormData,
} from './state-service/utils';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { ViewIndentService } from './view-indent.service';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
  updateFieldOptions,
} from '../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../shared/services/alert.service';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { TabConfig } from '../../../shared/components/nav-tab/nav-tab.component';

@Component({
  selector: 'app-view-indent',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './view-indent.component.html',
  styleUrl: './view-indent.component.scss',
})
export class ViewIndentComponent implements OnInit {
  @ViewChild('viewIndentFilter') viewIndentFilter!: FilterComponent;
  private viewIndentService = inject(ViewIndentService);
  private toastService = inject(AlertService);
  private modalService = inject(UniversalModalService);

  // Signals for form fields
  filterfields = signal<FieldConfig[]>(viewIndentFilterFields);
  editFields = signal<FieldConfig[]>(editFields);
  closeIntentField = signal<FieldConfig[]>(closeIntentField);
  addIntentFields = signal<FieldConfig[]>(addIntentFields);
  uploadIntentFields = signal<FieldConfig[]>(uploadIntentFields);
  addIntentFieldsSignal = signal<FieldConfig[]>([]);
  uploadIntentFieldsSignal = signal<FieldConfig[]>([]);

  // Table data and config
  indentRowData = signal<any[]>([]);
  token = localStorage.getItem('AccessToken') || '';

  selectedRowData = signal<any>(null);
  state = signal({
    milkList: [],
    plantList: [],
  });
  indentConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelectionMode: 'multiple',
    enableRowSelection: true,
    isRowSelectable: (params: any) => {
      return params?.closeStatus == 1 && this.usertype() === 'Manager';
    },
    context: {
      componentParent: this,
    },
    columns: [],
  });

  usertype = signal<any>('');
  ngOnInit() {
    this.token = localStorage.getItem('AccessToken') || '';
    this.usertype.set(localStorage.getItem('usertype') || '');
    console.log('User Type:', this.usertype());
    this.setupGrid();
    this.loadInitialData();
    this.initializeFields();
  }
  initializeFields() {
    this.addIntentFieldsSignal.set(addIntentFields);
    this.uploadIntentFieldsSignal.set(uploadIntentFields);
  }
  setupGrid() {
    this.indentConfig.update((config) => ({
      ...config,
      columns:
        this.usertype() === 'Manager' || this.usertype() == '12'
          ? [...viewIndentGridColumns, actionColumn]
          : viewIndentGridColumns,
    }));
  }

  async loadInitialData() {
    try {
      forkJoin({
        indentData: this.viewIndentService.getIndentData(formData),
        masterData:
          this.viewIndentService.getCreateIndentDataMilkAndPlantSupplier(
            masterFormData,
          ),
      })
        .pipe(
          catchError((error) => {
            handleApiError(
              error,
              this.toastService,
              'An error occurred while loading indent data',
            );
            return of({
              indentData: { Indents: [] },
              masterData: { Milk: [], PlantSupplier: [] },
            });
          }),
        )
        .subscribe((result: any) => {
          this.state.update((state) => ({
            ...state,
            milkList: result?.masterData.Milk || [],
            plantList: result?.masterData.PlantSupplier || [],
          }));
          this.setupFieldOptions();
          if (result?.indentData.Indents.length === 0) {
            this.toastService.info(
              'No indent data found for the selected criteria',
            );
            this.indentRowData.set(result?.indentData.Indents);
          } else {
            this.toastService.success('Indent data loaded successfully');
            this.indentRowData.set([]);
          }
        });
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        'An error occurred while loading indent data',
      );
    }
  }
  async onFormSubmit(data: any) {
    const params = {
      AccessToken: this.token,
      FromDate: data.from,
      ToDate: data.to,
      GroupId: localStorage.getItem('GroupId') || '',
      UserType: this.usertype(),
      SubRole: '',
      ForWeb: '1',
    };
    try {
      const res: any = await firstValueFrom(
        this.viewIndentService.getIndentData(params),
      );
      this.indentRowData.set(res?.Indents || []);
      console.log('row data', this.indentRowData());
    } catch (error) {}
  }
  handleSelectionChange(selected: any) {
    this.selectedRowData.set(selected);
  }
  onEditIndent(data: any) {
    this.modalService.openForm({
      title: 'Edit Indent',
      fields: this.editFields,
      mode: 'form',
      buttonName: 'Update',
      initialData: {
        quantity: data.quantity,
      },
      onSave: async (form: any) => {
        try {
          console.log('Form data to update:', form);
          const formData = {
            AccessToken: this.token,
            id: data.id,
            quantity: form.quantity, // Assuming only one field for editing
            ForApp: '0',
          };
          const res: any = await firstValueFrom(
            this.viewIndentService.updateData(formData),
          );
          handleApiResponse(
            res,
            this.toastService,
            () => this.loadInitialData(), // Success callback
            undefined,
            'Indent updated successfully',
          );
        } catch (error: any) {
          handleApiError(
            error,
            this.toastService,
            'An error occurred while updating indent',
          );
        }
      },
    });
  }
  async saveIntent(formData: any, type: 'form' | 'upload') {
    try {
      let params: any = {
        GroupId: localStorage.getItem('GroupId') || '',
        ForApp: '0',
      };

      if (type === 'form') {
        params = {
          ...params,
          target_date: formData?.targetDate ?? '',
          plant_id: formData?.toPlant?.id ?? '',
          plant_code: formData?.toPlant?.code ?? '',
          plant_name: formData?.toPlant?.name ?? '',
          quantity: formData?.quantity ?? '',
          milk_id: formData?.milkType?.id ?? '',
          milk_type: formData?.milkType?.code ?? '',
          milk_type_name: formData?.milkType?.name ?? '',
          supplier_id: formData?.fromSupplierPlant?.id ?? '',
          supplier_code: formData?.fromSupplierPlant?.code ?? '',
          supplier_name: formData?.fromSupplierPlant?.name ?? '',
          mcc_id: formData?.mcc?.mcc_id ?? '',
          mcc_code: formData?.mcc?.code ?? '',
          mcc_name: formData?.mcc?.name ?? '',
          repeat_indent: formData?.repeatIndent ?? '',
          fat: formData?.fat ?? '',
          snf: formData?.snf ?? '',
          mbrt: formData?.mbrt ?? '',
        };
      } else if (type === 'upload') {
        // ✅ Map form fields for UPLOAD INTENT
        params = {
          ...params,
          file: formData?.file ?? null, // Assuming file upload
          file_name: formData?.fileName ?? '',
          // Add other upload-specific fields as needed
        };
      }

      const apiFormData = createFormData(this.token, params);

      const res: any = await firstValueFrom(
        this.viewIndentService.createIntent(apiFormData, type),
      );

      // ✅ Use shared utility function
      handleApiResponse(
        res,
        this.toastService,
        () => this.loadInitialData(),
        undefined,
        `Intent ${type === 'form' ? 'created' : 'uploaded'} successfully`,
      );
    } catch (error: any) {
      handleApiError(
        error,
        this.toastService,
        `An error occurred while ${type === 'form' ? 'creating' : 'uploading'} intent`,
      );
    }
  }
  closeIntent() {
    if (!this.selectedRowData()) {
      this.toastService.warning('Please select at least one indent to close.');
      return;
    }
    this.modalService.openForm({
      title: 'Close Indent',
      fields: this.closeIntentField,
      mode: 'form',
      buttonName: 'Close',
      onSave: async (form: any) => {
        try {
          const formData = {
            AccessToken: this.token,
            remark: form.remarks, // Assuming only one field for editing
            ForApp: '0',
            id: this.selectedRowData().map((item: any) => item.id),
          };
          const res: any = await firstValueFrom(
            this.viewIndentService.closeIntent(formData),
          );
          handleApiResponse(
            res,
            this.toastService,
            () => this.loadInitialData(), // Success callback
            undefined,
            'Indent closed successfully',
          );
        } catch (error: any) {
          handleApiError(
            error,
            this.toastService,
            'An error occurred while closing indent',
          );
        }
      },
    });
  }
  private addIntentConfig = computed(() => ({
    title: 'Add Intent',
    mode: 'form',
    fields: this.addIntentFieldsSignal(),
    onSave: (formData: any) => {
      this.saveIntent(formData, 'form');
    },
    onControlValueChange: (controlName: string, value: any, form: any) => {
      if (controlName === 'fromSupplierPlant') {
        this.handleSupplierPlantChange(value, form);
      }
    },
    showFooter: true,
    initialData: {},
  }));
  openAddIndent() {
    // Create a computed config that updates whenever addIntentFieldsSignal changes

    const tabs: TabConfig[] = [
      {
        title: 'Add Intent',
        component: FilterFormComponent,
        componentInputs: {
          incomingConfig: {
            title: 'Add Intent',
            mode: 'form',
            fields: this.addIntentFieldsSignal(),
            onSave: (formData: any) => {
              this.saveIntent(formData, 'form');
            },
            onControlValueChange: (
              controlName: string,
              value: any,
              form: any,
            ) => {
              if (controlName === 'fromSupplierPlant') {
                this.handleSupplierPlantChange(value, form);
              }
            },
            showFooter: true,
            initialData: {},
          },
        },
      },
      {
        title: 'Upload',
        component: FilterFormComponent,
        componentInputs: {
          incomingConfig: {
            title: 'Upload Intent',
            mode: 'form',
            fields: this.uploadIntentFieldsSignal(),
            onSave: (formData: any) => {
              this.saveIntent(formData, 'upload');
            },
            showFooter: true,
            buttonName: 'Upload',
            btnClass: 'btn-primary ms-auto me-auto rounded',
          },
        },
      },
    ];

    this.modalService
      .openNavTabsModal({
        size: 'md',
        tabList: tabs,
        title: 'Manage Intents',
      })
      .then((result) => {
        if (result === 'success') {
          this.loadInitialData();
        }
      });
  }
  setupFieldOptions() {
    // Update "Milk Type" field options
    updateFieldOptions(
      this.addIntentFieldsSignal,
      'milkType',
      this.state().milkList, // From your master data
    );

    // Update "To Plant" field options
    updateFieldOptions(
      this.addIntentFieldsSignal,
      'toPlant',
      this.state().plantList.filter((item: any) => item.type == 3),
    );

    // Update "From Supplier/Plant" field options
    updateFieldOptions(
      this.addIntentFieldsSignal,
      'fromSupplierPlant',
      this.state().plantList.filter(
        (item: any) => item.type == 3 || item.type == 6,
      ),
    );

    // Clear MCC options initially (will be populated when supplier/plant is selected)
    updateFieldOptions(this.addIntentFieldsSignal, 'mcc', []);
  }

  async handleSupplierPlantChange(
    selectedSupplierPlant: any,
    form: any,
  ): Promise<void> {
    if (!selectedSupplierPlant) {
      updateFieldOptions(this.addIntentFieldsSignal, 'mcc', []);
      form.get('mcc')?.setValue(null);
      return;
    }
    const mccOptions = await getMccOptionsForSupplier(
      selectedSupplierPlant,
      this.viewIndentService,
    );
    const mccOptionsFormatted = mccOptions.map((mcc: any) => ({
      id: mcc.mcc_id,
      code: mcc.code,
      name: mcc.displayName,
    }));

    // Update the signal
    updateFieldOptions(this.addIntentFieldsSignal, 'mcc', mccOptionsFormatted);
    console.log(
      'MCC options updated based on supplier/plant selection:',
      this.addIntentFieldsSignal(),
    );
  }
}
