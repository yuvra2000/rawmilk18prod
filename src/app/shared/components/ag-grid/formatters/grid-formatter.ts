import { ValueGetterParams, CellClassParams, ColDef, ValueFormatterParams } from 'ag-grid-community';
import { STATUS_DEFINITIONS } from './util';

/**
 * A generic valueGetter that converts a status number to its text representation.
 * This is used for display and for exporting the correct text.
 * @param params AG Grid ValueGetterParams
 * @returns The status text (e.g., "Approved")
 */
export function statusValueGetter(params: ValueGetterParams): string {
  if (params.data && params.data.status != null) {
    const statusInfo = STATUS_DEFINITIONS[params.data.status];
    return statusInfo ? statusInfo.text : 'Unknown';
  }
  return '';
}

/**
 * A generic function to apply CSS classes based on the status value.
 * This is used for color-coding the cells.
 * @param params AG Grid CellClassParams
 * @returns The CSS class name (e.g., "status-approved")
 */
export function statusCellClass(params: CellClassParams): string | string[] {
    if (params.data && params.data.status != null) {
      const statusInfo = STATUS_DEFINITIONS[params.data.status];
      // You can also return an array of classes here if needed
      return statusInfo ? statusInfo.cssClass : 'status-unknown';
    }
    return '';
}




/**
 * Yeh ek "Smart" Column Definition Factory hai.
 * Yeh "Status" column ke liye poora configuration return karta hai.
 * Yeh 'overrides' mein diye gaye 'field' naam ko dynamically use karta hai.
 * @param overrides - Ek object jisse aap default properties ko badal sakte hain.
 */
export function createStatusColumn(overrides: Partial<ColDef> = {}): ColDef {
  
  // Step 1: Decide which field to use.
  // Agar user overrides mein 'field' bhejta hai, to use use karo, warna default 'status' use karo.
  const fieldName = overrides.field || 'status';
  const headerName = overrides.headerName || 'Status';
  const baseStatusDef: ColDef = {
    headerName: headerName,
    field: fieldName, // fieldName ko yahan bhi use karein
  

    // Step 2: Bracket notation `[]` ka use karke dynamically field se data nikalein.
    valueFormatter: (params: ValueFormatterParams) => {
      if (params.data && params.data[fieldName] != null) {
        const statusInfo = STATUS_DEFINITIONS[params.data[fieldName]];
        return statusInfo ? statusInfo.text : 'Unknown';
      }
      return '';
    },
    
    // Yahan bhi bracket notation ka use karein.
    cellClass: 'status-cell',
    cellClassRules: {
      'status-approved': params => params.data && params.data[fieldName] === 1,
      'status-pending':  params => params.data && params.data[fieldName] === 3,
      'status-delete':   params => params.data && params.data[fieldName] === 0,
      'status-de-active':params => params.data && params.data[fieldName] === 2
    }
  };

  return { ...baseStatusDef, ...overrides };
}