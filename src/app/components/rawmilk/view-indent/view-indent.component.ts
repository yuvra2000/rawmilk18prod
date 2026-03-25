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
  viewIndentFilterFields,
  viewIndentGridColumns,
} from './state-service/config';
import {
  AdvancedGridComponent,
  GridConfig,
} from '../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { firstValueFrom } from 'rxjs';
import { ViewIndentService } from './view-indent.service';
import { createFormData } from '../../../shared/utils/shared-utility.utils';
import { AlertService } from '../../../shared/services/alert.service';

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

  filterfields = signal<FieldConfig[]>(viewIndentFilterFields);
  indentRowData = signal<any[]>([]);
  token = localStorage.getItem('AccessToken') || '';
  indentConfig = signal<GridConfig>({
    theme: 'alpine',
    rowSelection: 'multiple',
    enableRowSelection: true,
    columns: [],
  });
  ngOnInit() {
    this.setupGrid();
    this.loadInitialData();
  }
  setupGrid() {
    this.indentConfig.update((config) => ({
      ...config,
      columns: viewIndentGridColumns,
    }));
  }
  async loadInitialData() {
    try {
      const toDate = new Date();
      toDate.setDate(toDate.getDate() + 7); // Set to date 7 days in the future
      const formData = createFormData(this.token, {
        from: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        to: toDate.toISOString().split('T')[0], // Date 7 days in the future in YYYY-MM-DD format
        GroupId: localStorage.getItem('GroupId') || '',
        UserType: '',
        SubRole: '',
        ForWeb: '1',
      });
      const res: any = await firstValueFrom(
        this.viewIndentService.getIndentData(formData),
      );

      this.indentRowData.set(res.Indents || []);
      if (res.Indents && res.Indents.length > 0) {
        this.toastService.success(
          res.message || 'Indent data loaded successfully',
        );
      } else {
        this.toastService.info(
          res.message || 'No indent data found for the selected date range.',
        );
      }
    } catch (error: any) {
      this.toastService.error(
        error?.error?.message ||
          'Failed to load indent data. Please try again later.',
      );
    }
  }
  onFormSubmit(data: any) {
    console.log('Form submitted with data:', data);
  }
  handleSelectionChange(selected: any) {
    console.log('Selected value:', selected);
  }
}
