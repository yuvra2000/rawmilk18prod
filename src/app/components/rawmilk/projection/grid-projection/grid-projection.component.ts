import { Component, computed, inject, input, signal } from '@angular/core';
import {
  AdvancedGridComponent,
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';
import { UniversalModalService } from '../../../../shared/services/universal-modal.service';
import {
  addProjectionFieldsModal,
  editProjectionFields,
} from './state-service/config';
import { userType } from '../state-service/config';
import { ProjectionStore } from '../state-service/store';
import { createFormData } from '../../../../shared/utils/shared-utility.utils';
import { firstValueFrom } from 'rxjs';
import { ProjectionService } from '../projection.service';
import { res } from './state-service/res';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-grid-projection',
  standalone: true,
  imports: [AdvancedGridComponent],
  templateUrl: './grid-projection.component.html',
  styleUrl: './grid-projection.component.scss',
})
export class GridProjectionComponent {
  store: ProjectionStore = new ProjectionStore();
  projectionData = input<any>([]);
  token: string = localStorage.getItem('AccessToken') || ''; // Initialize with your token or get from auth service
  projdummyData = signal<any>(res);
  private projectionService = inject(ProjectionService);
  week = input<number>(1);
  currentMonth: string;
  currentMonthForm = input<string>('');
  private modalService = inject(UniversalModalService);
  private toast = inject(AlertService);
  constructor() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString(); // Ensure two digits
    this.currentMonth = `${month}`;
  }

  private readonly baseColumns: GridColumnConfig[] = [
    {
      headerName: 'S.No.',
      valueGetter: (params: any) => params.node?.rowIndex + 1,
      width: 90,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'MCC',
      valueGetter: (params: any) => params.data?.Mcc || params.data?.MCC || '',
    },
    {
      headerName: 'Milk Type',
      valueGetter: (params: any) =>
        params.data?.MilkType || params.data?.milktype || '',
    },
    {
      headerName: 'Supplier',
      valueGetter: (params: any) =>
        params.data?.Supplier || params.data?.supplier || '',
    },
  ];

  private getResolvedProjectionData(): any {
    const value = this.projectionData();
    // const value = this.projdummyData();
    return typeof value === 'function' ? value() : value;
  }

  private getWeekRows(week: number): any[] {
    const resolvedValue = this.getResolvedProjectionData();

    if (Array.isArray(resolvedValue)) {
      return resolvedValue;
    }

    if (resolvedValue && typeof resolvedValue === 'object') {
      const weekKey = `W${week || 1}`;
      const weekRows = resolvedValue[weekKey];
      return Array.isArray(weekRows) ? weekRows : [];
    }

    return [];
  }

  private getDayColumns(week: number, weekRows: any[]): GridColumnConfig[] {
    const sampleRow = weekRows[0] || {};
    const dayKeys = Object.keys(sampleRow)
      .filter((key) => /^D\d+$/.test(key))
      .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

    const weekOffset = (Math.max(week, 1) - 1) * 8;
    let currentMonth = this.currentMonthForm() || this.currentMonth;
    if (this.currentMonthForm()) {
      const monthPart = this.currentMonthForm().split('-')[1]; // Gets "01" from "2026-01"
      currentMonth = parseInt(monthPart, 10).toString(); // Convert "01" to "1"
    }
    console.log('Current Month in getDayColumns:', currentMonth); // Debug log
    return dayKeys.map((dayKey, index) => {
      const dayNumber = weekOffset + index + 1;
      return {
        headerName: `${dayNumber} / ${currentMonth}`,
        headerTooltip: `Day ${dayNumber} / Month ${currentMonth}`,
        cellRenderer: (params: any) => {
          const span = document.createElement('span');
          const qty = params.data?.[dayKey]?.Qty;
          span.style.cursor = 'pointer';
          span.textContent = qty === '' ? '-' : qty;
          if (userType === 'Supplier' || userType === 'ChillingPlant') {
            span.addEventListener('dblclick', () => {
              if (!params.data?.[dayKey]?.id) {
                this.addProjection(dayKey, params);
                return;
              }

              if (
                this.isDateInRange(
                  this.store.initialData().PrjAddStartDate,
                  this.store.initialData().PrjAddEndDate,
                )
              ) {
                this.openEditProjectionModal(dayKey, params);
              } else {
                this.toast.info('Not allowed to edit projection today');
              }
            });
          }
          return span;
        },
      } as GridColumnConfig;
    });
  }

  private getWeekColumns(week: number, weekRows: any[]): GridColumnConfig[] {
    return [...this.baseColumns, ...this.getDayColumns(week, weekRows)];
  }

  rowData = computed<any[]>(() => {
    return this.getWeekRows(this.week() || 1);
  });

  projectionConfig = computed<GridConfig>(() => ({
    theme: 'alpine',
    columns: this.getWeekColumns(this.week() || 1, this.rowData()),
    pagination: true,
    paginationPageSize: 50,
    enableSearch: true,
    enableExport: true,
    height: '200px',
    context: {
      componentParent: this,
    },
  }));
  private async submitProjectionForm(
    mode: 'add' | 'edit',
    form: any,
    params: any,
    dayKey: string,
  ): Promise<void> {
    let formData: FormData;
    let res: any;
    if (mode === 'edit') {
      // Edit mode - update existing projection
      const dataForDay = params.data?.[dayKey] || {};
      formData = createFormData(this.token, {
        ProjectionId: dataForDay.id || '',
        Quantity: form.quantity || '',
        ProjectionDate: form.date || '',
        ForWeb: '1',
      });
      res = await firstValueFrom(
        this.projectionService.updateProjection(formData),
      );
    } else if (mode === 'add') {
      formData = createFormData(this.token, {
        MilkId: params.data?.MilkId || '',
        SupplierId: params.data?.SupplierId || '',
        MccId: params.data?.MccId || '',
        ProjectionDate: form.date || '',
        Quantity: form.qnt || form.quantity || '',
        ForWeb: '1',
      });
      res = await firstValueFrom(
        this.projectionService.addProjectionSingle(formData),
      );
    }
    if (res && res.success) {
      this.toast.success(
        `Projection ${mode === 'edit' ? 'updated' : 'added'} successfully`,
      );
      return res;
      // Optionally, refresh the data or update the local state to reflect changes
    } else {
      this.toast.error(
        `Failed to ${mode === 'edit' ? 'update' : 'add'} projection`,
      );
      return res;
    }
  }

  addProjection(dayKey: string, params: any) {
    const dataForDay = params.data?.[dayKey] || {};
    this.modalService.openForm({
      title: 'Add Projection',
      fields: addProjectionFieldsModal, // Define form fields as needed
      mode: 'form',
      onSave: async (form: any) => {
        await this.submitProjectionForm('add', form, params, dayKey);
      },
      initialData: {
        quantity: dataForDay.Qty || '',
        date: dataForDay.ProjectionDate || '',
        milkType: params?.data?.MilkType || '',
        mcc: params?.data?.Mcc || '',
      },
    });
  }

  openEditProjectionModal(dayKey: string, params: any) {
    const dataForDay = params.data?.[dayKey] || {};
    this.modalService.openForm({
      title: 'Edit Projection',
      fields: editProjectionFields, // Define form fields as needed
      mode: 'form',
      onSave: async (form: any) => {
        await this.submitProjectionForm('edit', form, params, dayKey);
      },
      initialData: {
        quantity: dataForDay.Qty || '',
        date: dataForDay.ProjectionDate || '',
      },
    });
  }
  isDateInRange(startDate: string, endDate: string): boolean {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    return today >= start && today <= end;
  }
}
