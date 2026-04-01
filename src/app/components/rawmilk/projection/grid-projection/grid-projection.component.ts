import { Component, computed, input } from '@angular/core';
import {
  AdvancedGridComponent,
  GridColumnConfig,
  GridConfig,
} from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

@Component({
  selector: 'app-grid-projection',
  standalone: true,
  imports: [AdvancedGridComponent],
  templateUrl: './grid-projection.component.html',
  styleUrl: './grid-projection.component.scss',
})
export class GridProjectionComponent {
  projectionData = input<any>([]);
  week = input<number>(1);
  currentMonth: string;

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

    return dayKeys.map((dayKey, index) => {
      const dayNumber = weekOffset + index + 1;
      return {
        headerName: `${dayNumber} / ${this.currentMonth}`,
        valueGetter: (params: any) => params.data?.[dayKey]?.Qty ?? '',
        type: 'numericColumn',
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
  }));
}
