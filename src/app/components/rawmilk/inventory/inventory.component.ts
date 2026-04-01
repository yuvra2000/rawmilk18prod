import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseWrapperComponent } from '../../../shared/components/collapse-wrapper/collapse-wrapper.component';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../shared/components/filter-form/filter-form.component';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import {
  addInventory,
  inventoryFilterFields,
  inventoryTableColumns,
} from './state-service/config';
import { InventoryService } from './inventory.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { getTodayDate, handleError, sessionCheck } from './state-service/utils';
import { Router } from '@angular/router';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  private router = inject(Router);
  private modalService = inject(UniversalModalService);
  // User and session data
  token: string = '';
  groupId: string = '';
  supplierId: string = '';
  userType: string = '';

  // Filter data signals
  mccList = signal<any[]>([]);
  milkTypeList = signal<any[]>([]);
  supplierList = signal<any[]>([]);

  // Dynamic filter fields computed from API data
  filterfields = computed<FieldConfig[]>(() =>
    inventoryFilterFields(
      this.mccList(),
      this.milkTypeList(),
      this.supplierList(),
    ),
  );
  addInventoryFields = computed<FieldConfig[]>(() => addInventory);

  initialData = signal({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  // Grid data and configuration
  inventoryRowData = signal<any[]>([]);
  inventoryConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: inventoryTableColumns,
    data: [],
    pagination: true,
    paginationPageSize: 50,
    enableExport: true,
    enableSearch: true,
  });

  constructor(
    private inventoryService: InventoryService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.initializeUserData();
    this.initializePageData();
  }

  /**
   * Initialize user session data from localStorage
   */
  private initializeUserData(): void {
    this.token = localStorage.getItem('AccessToken') || '';
    this.groupId = localStorage.getItem('GroupId') || '';
    this.supplierId = localStorage.getItem('supplier_id') || '';
    this.userType = localStorage.getItem('usertype') || '';
  }

  /**
   * Initialize all page data using forkJoin for parallel API calls
   */
  private initializePageData(): void {
    const filterParams = createFormData(this.token, {
      GroupId: this.groupId,
      supplier_id: this.supplierId,
      ForApp: '0',
    });

    const reportParams = createFormData(this.token, {
      GroupId: this.groupId,
      SupplierId: this.supplierId,
      FromDate: getTodayDate(),
      ToDate: getTodayDate(),
      ForWeb: '1',
      Category: '',
      MilkId: '',
      MccId: '',
    });

    this.spinner.show();

    this.inventoryService
      .initializePageData(filterParams, reportParams)
      .subscribe({
        next: (result) => {
          this.handleInitializationSuccess(result);
          this.spinner.hide();
        },
        error: (error) => {
          handleError(error, this.toast);
          this.spinner.hide();
        },
      });
  }

  /**
   * Handle successful initialization response
   */
  private handleInitializationSuccess(result: any): void {
    // Populate filter options
    if (result.filterOptions) {
      // Handle MCC data
      if (result.filterOptions.mccData?.Status === 'success') {
        this.mccList.set(result.filterOptions.mccData.Data || []);
        addInventory.forEach((field) => {
          if (field.name === 'mcc') {
            field.options = result.filterOptions.mccData.Data || [];
          }
        });
      }

      // Handle master data (milk types, plants, etc.)
      if (result.filterOptions.masterData?.Status === 'success') {
        const masterData = result.filterOptions.masterData;
        this.milkTypeList.set(masterData.Milk || []);
        this.supplierList.set(
          masterData.PlantSupplier?.filter((s: any) => s.type == 6) || [],
        );
        addInventory.forEach((field) => {
          if (field.name === 'milkSamples') {
            field.formArrayFields?.forEach((subField) => {
              if (subField.name === 'milkType') {
                subField.options = masterData.Milk || [];
              }
            });
          }
        });
      }
    }

    // Populate initial inventory data
    if (result.inventoryData?.Status === 'success') {
      const inventoryData = result.inventoryData.Data || [];
      this.inventoryRowData.set(inventoryData);
      this.updateGridData(inventoryData);
    }
  }

  /**
   * Update grid configuration with new data
   */
  private updateGridData(data: any[]): void {
    this.inventoryConfig.update((config) => ({
      ...config,
      data: data,
    }));
  }
  openAddInventory() {
    this.modalService.openForm({
      title: 'Add Inventory',
      fields: this.addInventoryFields, // Define fields for adding inventory
      mode: 'form',
      size: 'lg',
      onSave: async (formData, fetchedData) => {
        console.log('Form data to save:', formData);
      },
      initialData: {
        date: new Date().toISOString().split('T')[0],
      },
    });
  }
  /**
   * Handle form submission for filtering data
   */
  onFormSubmit(formData: any): void {
    const params = createFormData(this.token, {
      GroupId: this.groupId,
      supplier_id: this.supplierId,
      from: formData.from || '',
      to: formData.to || '',
      mcc_id: formData.mcc?.mcc_id || '',
      milk_type_id: formData.milkType?.id || '',
      category: formData.category?.id || '',
    });

    this.spinner.show();

    this.inventoryService.getInventoryReport(params).subscribe({
      next: (response) => {
        if (response.Status === 'success') {
          const data = response.Data || [];
          this.inventoryRowData.set(data);
          this.updateGridData(data);
          this.toast.success('Inventory data loaded successfully');
        } else {
          sessionCheck(response, this.toast, this.router);
        }
        this.spinner.hide();
      },
      error: (error) => {
        handleError(error, this.toast);
        this.spinner.hide();
      },
    });
  }

  /**
   * Handle view inventory action from grid
   */
  onViewInventory(data: any): void {
    console.log('View inventory item:', data);
    // Implement view logic
  }

  /**
   * Handle edit inventory action from grid
   */
  onEditInventory(data: any): void {
    console.log('Edit inventory item:', data);
    // Implement edit logic
  }

  /**
   * Handle general errors
   */

  isEditable(startEditDateTime: string, endEditDateTime: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(startEditDateTime.replace(' ', 'T'));
    const endDate = new Date(endEditDateTime.replace(' ', 'T'));

    return currentDate >= startDate && currentDate <= endDate;
  }
  async onFilterChange(event: any) {
    if (event.name === 'supplier') {
      const params = {
        AccessToken: this.token,
        GroupId: this.groupId,
        supplier_id: event.value?.id || '',
        ForApp: '0',
      };
      try {
        const res: any = await firstValueFrom(
          this.inventoryService.getMCCData(params),
        );
        this.mccList.set(res.Data || []);
      } catch (error) {}
    }
  }
}
