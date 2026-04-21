import { createFormData } from '../../../../shared/utils/shared-utility.utils';
import { GridColumnConfig } from '../../../../shared/components/ag-grid/ag-grid/ag-grid.component';

const token = localStorage.getItem('AccessToken') || '';

export interface AddaWiseDynamicPayload {
  header?: string[];
  body?: Record<string, any>[];
}

export function createReportParams(filterValues?: any) {
  return createFormData(token, {
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

export function buildAddaWiseDynamicColumns(
  headers: string[] = [],
  onDetailClick?: (tooltip: any, headerName: string) => void,
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
      width: header === 'Sr No' ? 90 : undefined,
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
            span.style.color = '#1D4380';
            span.style.cursor = 'pointer';
            span.style.textDecoration = 'underline';
            span.addEventListener('click', () => {
              if (onDetailClick) {
                onDetailClick(tooltip, header);
              }
            });
            return span;
          }
        : undefined,
      valueGetter: !isDateColumn
        ? (params: any) => getDisplayValue(params.data?.[header])
        : undefined,
    } as GridColumnConfig;
  });
}

export function parseAddaWiseDynamicGridData(
  payload: any,
  onDetailClick?: (tooltip: any, headerName: string) => void,
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
