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
  editInventoryFields,
  inventoryFilterFields,
  inventoryTableColumns,
} from './state-service/config';
import { InventoryService } from './inventory.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  buildCreateInventoryPayload,
  getTodayDate,
  getTomorrowDate,
  handleError,
  sessionCheck,
} from './state-service/utils';
import { Router } from '@angular/router';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { AlertService } from '../../../shared/services/alert.service';
import { firstValueFrom } from 'rxjs';
import {
  Breadcrumb,
  CommonHeaderComponent,
} from '../../../shared/components/common-header/common-header.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
    SharedModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  private router = inject(Router);
  private modalService = inject(UniversalModalService);
  private alertService = inject(AlertService);
  // User and session data
  token: string = '';
  groupId: string = '';
  supplierId: string = '';
  userType: string = '';
  loading = signal(false);

  // Filter data signals
  mccList = signal<any[]>([]);
  milkTypeList = signal<any[]>([]);
  milkTypeListModal = signal<any[]>([]);
  supplierList = signal<any[]>([]);
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/home' },
    { label: 'Inventory', url: '' },
  ];
  // Dynamic filter fields computed from API data
  filterfields = computed<FieldConfig[]>(() =>
    inventoryFilterFields(
      this.mccList(),
      this.milkTypeList(),
      this.supplierList(),
    ),
  );
  editInventoryFields = computed<FieldConfig[]>(() =>
    editInventoryFields(this.milkTypeListModal()),
  );
  addInventoryFields = computed<FieldConfig[]>(() => addInventory);

  initialData = signal({
    from: new Date().toISOString().split('T')[0],
    to: getTomorrowDate(),
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
    autoSizeColumns: true,
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
    this.loading.set(true);

    this.inventoryService
      .initializePageData(filterParams, reportParams)
      .subscribe({
        next: (result) => {
          this.handleInitializationSuccess(result);
          this.spinner.hide();
        },
        error: (error) => {
          handleError(error, this.toast);
        },
        complete: () => {
          this.loading.set(false);
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
        this.milkTypeListModal.set(masterData.Milk || []);
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
        await this.createInventoryData(formData);
      },
      initialData: {
        date: new Date().toISOString().split('T')[0],
      },
    });
  }
  async createInventoryData(value: any): Promise<void> {
    this.spinner.show();
    this.loading.set(true);
    try {
      const payload = buildCreateInventoryPayload(value);
      const response: any = await firstValueFrom(
        this.inventoryService.createInventory(payload),
      );
      if (response?.Status === 'success') {
        this.toast.success('Inventory created successfully');
        // this.refreshInventoryData();
      } else {
        sessionCheck(response, this.toast, this.router);
      }
    } catch (error) {
      handleError(error, this.toast);
    } finally {
      this.loading.set(false);
      this.spinner.hide();
    }
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
    this.loading.set(true);
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
      complete: () => {
        this.loading.set(false);
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
    this.modalService.openForm({
      title: 'Edit Inventory',
      fields: this.editInventoryFields, // Reuse add inventory fields for editing
      mode: 'form',
      size: 'xl',
      onSave: async (formData, fetchedData) => {
        this.editInventoryData(formData, data);
      },
      initialData: {
        milkType: data.MilkType,
        quantity: data.Qty || 0,
        fat: data.Fat || 0,
        snf: data.Snf || 0,
        mbrt: data.Mbrt || '',
      },
      filterButtonClass: 'mt-4',
      buttonName: 'Update ',
    });
  }
  /**
   * Handle delete inventory action from grid
   */
  async onDeleteInventory(data: any): Promise<void> {
    try {
      // Show confirmation dialog with specific inventory details
      const isConfirmed = await this.alertService.confirmDelete(
        'Delete Inventory?',
        `Are you sure you want to delete inventory for ${data.MccName}?`,
        'Yes, delete it!',
        'Cancel',
      );

      if (!isConfirmed) {
        return;
      }

      // Show loading spinner
      this.spinner.show();

      // Prepare delete parameters
      const deleteParams = createFormData(this.token, {
        GroupId: this.groupId,
        InventoryId: data.InventoryId, // Adjust field name based on your data structure
        SupplierId: this.supplierId,
      });

      // Call delete API
      const response = await firstValueFrom(
        this.inventoryService.deleteInventory(deleteParams),
      );

      this.spinner.hide();

      if (response.Status === 'success') {
        // Show success message
        await this.alertService.showSuccess(
          'Deleted!',
          `Inventory for ${data.MccName} has been successfully deleted.`,
        );

        // Refresh the inventory data
        this.refreshInventoryData();
      } else {
        // Handle API error response
        sessionCheck(response, this.toast, this.router);
      }
    } catch (error) {
      this.spinner.hide();
      // console.error('Delete inventory error:', error);

      await this.alertService.showError(
        'Delete Failed',
        'Failed to delete inventory. Please try again later.',
      );

      // handleError(error, this.toast);
    }
  }
  async editInventoryData(formData: any, data: any): Promise<void> {
    const invedata = {
      Qty: formData.quantity ?? data.quantity ?? 0,
      Fat: formData.fat ?? data.Fat ?? 0,
      Snf: formData.snf ?? data.Snf ?? 0,
      Mbrt: formData.mbrt ?? data.mbrt ?? '',
    };

    const payloads = createFormData(this.token, {
      ForWeb: '1',
      InventoryId: String(data.InventoryId ?? ''),
      MccId: String(data.MccId ?? ''),
      InventoryData: JSON.stringify(invedata),
    });
    const response: any = await firstValueFrom(
      this.inventoryService.updateInventory(payloads),
    );
    if (response.Status === 'success') {
      this.toast.success('Inventory updated successfully');
      this.refreshInventoryData();
    } else {
      sessionCheck(response, this.toast, this.router);
    }
  }
  /**
   * Refresh inventory data after operations
   */
  private refreshInventoryData(): void {
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
    this.loading.set(true);
    this.inventoryService.getInventoryReport(reportParams).subscribe({
      next: (response) => {
        if (response.Status === 'success') {
          const data = response.Data || [];
          this.inventoryRowData.set(data);
          this.updateGridData(data);
        }
      },
      error: (error) => {
        handleError(error, this.toast);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
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
