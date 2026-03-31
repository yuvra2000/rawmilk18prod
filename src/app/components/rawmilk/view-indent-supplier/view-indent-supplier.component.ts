import {
  Component,
  signal,
  OnInit,
  inject,
  viewChild,
  ViewChild,
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
  editFields,
  viewDispatchColumns,
  viewIndentSupplierFilterFields,
  viewIndentSupplierGridColumns,
  viewIndentSupplierGridColumnsDetailed,
  viewIndentSupplierGridColumnsIfNotChillingPlant,
  viewNoOfDispatchColumns,
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
import { catchError, firstValueFrom, forkJoin, from, of } from 'rxjs';
import {
  createFormData,
  handleApiError,
  handleApiResponse,
  updateFieldOptions,
} from '../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../shared/services/alert.service';
import { UniversalModalService } from '../../../shared/services/universal-modal.service';
import { ViewIndentSupplierService } from './view-indent-supplier.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonHeaderComponent } from '../../../shared/components/common-header/common-header.component';
import { Router } from '@angular/router';
interface formResponse {
  Indents: any[];
  Message: string;
  Status: string;
}
@Component({
  selector: 'app-view-indent-supplier',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
    // CommonHeaderComponent,
  ],
  templateUrl: './view-indent-supplier.component.html',
  styleUrl: './view-indent-supplier.component.scss',
})
export class ViewIndentSupplierComponent implements OnInit {
  private viewIndentSupplierService = inject(ViewIndentSupplierService);
  private modalService = inject(UniversalModalService);
  private loader = inject(NgxSpinnerService);
  private router = inject(Router);
  filterfields = signal<FieldConfig[]>(viewIndentSupplierFilterFields);
  indentRowData = signal<any[]>([]);
  pageTitle = 'View Indents';
  breadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Raw Milk', link: '/rawmilk' },
    { label: 'View Indents', link: '/rawmilk/view-indents' },
  ];
  initialData = signal({
    from: new Date().toISOString().split('T')[0],
    to: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split('T')[0],
  });
  indentConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [],
  });
  userType = '';
  token: any;
  ngOnInit(): void {
    this.token = localStorage.getItem('AccessToken') || '';
    this.userType = localStorage.getItem('usertype')!;
    if (this.userType !== 'ChillingPlant') {
      this.filterfields.set([
        ...viewIndentSupplierFilterFields,
        ...viewIndentSupplierGridColumnsIfNotChillingPlant,
      ]);
    } else {
      this.filterfields.set([...viewIndentSupplierFilterFields]);
    }
    this.loadInitialData();
    this.setupGrid();
  }
  private async loadInitialData() {
    try {
      this.loader.show();
      const res: any = await firstValueFrom(
        this.viewIndentSupplierService.getIndentData(formData),
      );
      this.indentRowData.set(res?.Indents || []);
    } catch (error) {
      console.error('Error occurred while fetching indent data:', error);
    } finally {
      this.loader.hide();
    }
  }
  setupGrid() {
    this.indentConfig.update((config) => ({
      ...config,
      columns: [...viewIndentSupplierGridColumns, actionColumn],
    }));
  }
  async onFormSubmit(data: any) {
    try {
      const formData = createFormData(this.token, {
        FromDate: data.from,
        ToDate: data.to,
        GroupId: localStorage.getItem('GroupId') || '',
        UserType: localStorage.getItem('usertype') || '',
        SubRole: '',
        ForWeb: '1',
      });
      const res: any = await firstValueFrom(
        this.viewIndentSupplierService.getIndentData(formData),
      );
      this.indentRowData.set(res?.Indents || []);
    } catch (error) {
      console.error('Error occurred while fetching indent data:', error);
    }
  }
  onFilterChange(event: any) {
    if (event.field === 'reportType') {
      const isStandard = event.value === 'Standard';
      this.indentConfig.update((config) => ({
        ...config,
        columns: isStandard
          ? [...viewIndentSupplierGridColumns]
          : [...viewIndentSupplierGridColumnsDetailed],
      }));
    }
  }
  async viewIndent(indentId: any) {
    try {
      const params = {
        AccessToken: this.token,
        GroupId: localStorage.getItem('GroupId') || '',
        UserType: localStorage.getItem('usertype') || '',
        SubRole: '',
        IndentId: indentId,
        ForWeb: 1,
      };
      const res: any = await firstValueFrom(
        this.viewIndentSupplierService.viewAllocationProc(params),
      );
      this.modalService.openGridModal({
        title: `Indent Details - ID: ${indentId}`,
        columns: viewDispatchColumns,
        rowData: res?.Allocation || [],
        size: 'xl',
        context: {
          componentParent: this,
        },
      });
    } catch (error) {}
    // Implement the logic to view indent details, e.g., open a modal with details
  }
  fetchIndentValue(indentId: any, quantity: any, actionType: any) {
    this.router.navigate(['/Allocate'], {
      state: {
        // structuredata: { Id: indentId, quan: quantity, status: actionType },
        structuredata: { Id: indentId, quan: quantity, status: 'Edit' },
        array: 'worldgyan',
      },
    });
  }
}
