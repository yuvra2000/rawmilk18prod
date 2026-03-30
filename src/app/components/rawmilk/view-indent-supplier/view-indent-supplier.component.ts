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
  viewIndentSupplierGridColumnsIfNotChillingPlant,
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
@Component({
  selector: 'app-view-indent-supplier',
  standalone: true,
  imports: [
    FilterComponent,
    NgSelectModule,
    CollapseWrapperComponent,
    FilterFormComponent,
    AdvancedGridComponent,
  ],
  templateUrl: './view-indent-supplier.component.html',
  styleUrl: './view-indent-supplier.component.scss',
})
export class ViewIndentSupplierComponent implements OnInit {
  private viewIndentSupplierService = inject(ViewIndentSupplierService);
  private modalService = inject(UniversalModalService);
  private loader = inject(NgxSpinnerService);
  filterfields = signal<FieldConfig[]>(viewIndentSupplierFilterFields);
  indentRowData = signal<any[]>([]);
  indentConfig = signal<GridConfig>({
    theme: 'alpine',
    context: {
      componentParent: this,
    },
    columns: [],
  });
  userType = '';
  ngOnInit(): void {
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
  onFormSubmit(data: any) {}
  onViewDispatches(indentData: any) {
    this.modalService.openGridModal({
      title: `Dispatches for Indent #${indentData.indent_no}`,
      columns: viewDispatchColumns,
      rowData: indentData?.dispatchData,
    });
  }
}
