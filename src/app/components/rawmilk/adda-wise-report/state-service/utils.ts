import {
  createFormData,
  GroupId,
} from '../../../../shared/utils/shared-utility.utils';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

const token = localStorage.getItem('AccessToken') || '';

export interface AddaWiseDynamicPayload {
  header?: string[];
  body?: Record<string, any>[];
}

export function createReportParams(filterValues?: any) {
  return createFormData(token, {
    group_id: GroupId,
    fromDate: filterValues?.from || filterValues?.fromDate || '',
    toDate: filterValues?.to || filterValues?.toDate || '',
  });
}

function getDisplayValue(cellValue: any): any {
  if (cellValue && typeof cellValue === 'object' && !Array.isArray(cellValue)) {
    if ('display' in cellValue) {
      return cellValue.display;
    }
  }
  return cellValue;
}

function getColumnWidth(header: string): number {
  const normalizedHeader = header.trim().toLowerCase();

  if (normalizedHeader === 'sr no') {
    return 80;
  }

  if (
    normalizedHeader === 'adda name' ||
    normalizedHeader === 'adda geocoords'
  ) {
    return 210;
  }

  return 140;
}

export function buildAddaWiseDynamicColumns(
  headers: string[] = [],
  onDetailClick?: (tooltip: any, headerName: string, event?: any) => void,
): GridColumnConfig[] {
  return headers.map((header, index) => {
    const isPinned = index <= 2;
    const isDateColumn = /^\d{4}-\d{2}-\d{2}$/.test(header);

    return {
      headerName: header,
      field: header,
      sortable: true,
      filter: true,
      pinned: isPinned ? 'left' : undefined,
      width: getColumnWidth(header),
      cellRenderer: isDateColumn
        ? (params: any) => {
            const cellValue = params.data?.[header];
            const displayValue = getDisplayValue(cellValue);
            const tooltip = cellValue?.tooltip;

            if (!displayValue || !tooltip) {
              return displayValue || '';
            }

            const span = document.createElement('span');
            span.innerText = displayValue;
            span.style.color = displayValue != 0 ? '#1D4380' : 'inherit';
            span.style.cursor = displayValue != 0 ? 'pointer' : 'default';
            span.style.textDecoration =
              displayValue != 0 ? 'underline' : 'none';
            span.addEventListener('click', () => {
              if (onDetailClick) {
                onDetailClick(tooltip, header, params);
              }
            });
            return span;
          }
        : undefined,
      tooltipValueGetter: (params: any) => {
        if (isDateColumn) {
          return 'Count of Cart (Avg Time)';
        }
        return '';
      },
    } as GridColumnConfig;
  });
}

export function parseAddaWiseDynamicGridData(
  payload: any,
  onDetailClick?: (tooltip: any, headerName: string, event?: any) => void,
): {
  columns: GridColumnConfig[];
  rows: any[];
} {
  const headers: string[] = payload?.header || [];
  const rows: any[] = payload?.body || [];

  if (headers.length > 0) {
    return {
      columns: buildAddaWiseDynamicColumns(headers, onDetailClick),
      rows,
    };
  }

  const fallbackRows: any[] = Array.isArray(payload) ? payload : [];
  const fallbackHeaders = fallbackRows.length
    ? Object.keys(fallbackRows[0])
    : [];

  return {
    columns: buildAddaWiseDynamicColumns(fallbackHeaders, onDetailClick),
    rows: fallbackRows,
  };
}
