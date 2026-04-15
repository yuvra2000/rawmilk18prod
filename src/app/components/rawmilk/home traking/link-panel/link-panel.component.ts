import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { HomeService } from '../home.service';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import * as XLSX from 'xlsx';

// export const checkboxColumn: ColDef = {
//   headerCheckboxSelection: true,
//   checkboxSelection: true,
//   width: 50
// };

export interface GridColumn {
  field?: string;
  header: string;
  type?: 'text' | 'checkbox' | 'icon';
  iconClass?: string;
  iconColor?: string;
  iconSize?: number;      // font-size (px)
  iconWidth?: number;     // column width (px)
  iconHeight?: number;
  sortable?: boolean;
  filterable?: boolean;
}

@Component({
  selector: 'app-link-panel',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectComponent, NgbModule, AgGridAngular],
  templateUrl: './link-panel.component.html',
  styleUrl: './link-panel.component.scss'
})

export class LinkPanelComponent {
  defaultSortable = true;
  defaultFilterable = true;

  filterForm!: FormGroup;

  @Input() rowData: any[] = [];
  @Input() columns: any[] = [];
  @Input() searchText = '';
  @Input() exportTrigger = 0;
  columnDefs: ColDef[] = [];
  private gridApi!: GridApi;

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnChanges(changes: SimpleChanges) {

    this.buildColumns();
    // if (changes['exportTrigger'] && this.gridApi) {
    //   this.exportExcel();
    // }
  }
  // @Input() color: any = "";
  exportExcel() {
    const filteredData: any[] = [];

    this.gridApi.forEachNodeAfterFilter(node => {
      filteredData.push(node.data);
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
    XLSX.writeFile(workbook, 'geofence-data.xlsx');
  }
  @Output() iconAction = new EventEmitter<{ row: any; column: any }>();
  @Output() selectedRowsChange = new EventEmitter<any[]>();



  onSelectionChanged() {
    console.log("select", this.gridApi)
    const rows = this.gridApi.getSelectedRows();
    this.selectedRowsChange.emit(rows);
  }
  buildColumnsold() {
    this.columnDefs = this.columns.map(col => {

      // ✅ Checkbox column
      if (col.type === 'checkbox') {
        return {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 50,
          filter: false,
        };
      }

      // ✅ Icon column (merged inside grid)
      if (col.type === 'icon') {
        return {
          headerName: col.header,
          width: 90,
          sortable: col.sortable ?? false,
          filter: col.filterable ?? false,
          // cellRenderer: (params: any) => {
          //   const icon = document.createElement('i');
          //   icon.className = col.iconClass || 'fa fa-eye';
          //   icon.style.cursor = 'pointer';
          //   // icon.style.color = '#2563eb';
          //   icon.style.color = col.iconColor || '#2563eb';
          //   icon.style.fontSize = (col.iconSize ?? 16) + 'px';
          //   icon.style.lineHeight = (col.iconHeight ?? 20) + 'px';

          //   icon.addEventListener('click', (e) => {
          //     e.stopPropagation();
          //     this.iconAction.emit({ row: params.data, column: col });
          //   });

          //   return icon;
          // }
          cellRenderer: (params: any) => {
            const icon = document.createElement('i');

            const iconClass = typeof col.iconClass === 'function'
              ? col.iconClass(params.data)
              : col.iconClass;

            const iconColor = typeof col.iconColor === 'function'
              ? col.iconColor(params.data)
              : col.iconColor;

            // ✅ Apply icon
            icon.className = iconClass ? `fa ${iconClass}` : 'fa fa-eye';

            // ✅ FORCE color (strongest possible way)
            if (iconColor) {
              icon.style.cssText = `
      color: ${iconColor} !important;
      cursor: pointer;
      font-size: ${col.iconSize ?? 16}px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
            }

            // Tooltip
            if (col.tooltip) {
              const tooltip = typeof col.tooltip === 'function'
                ? col.tooltip(params.data)
                : col.tooltip;
              icon.title = tooltip;
            }

            // Click
            icon.onclick = (e: any) => {
              e.stopPropagation();
              this.iconAction.emit({ row: params.data, column: col });
            };

            return icon;
          }
        };
      }

      // ✅ Normal text column
      return {
        headerName: col.header,
        field: col.field,
        // sortable: true,
        // filter: true,
        // width: 100,
        sortable: col.sortable ?? this.defaultSortable,
        filter: col.filterable ?? this.defaultFilterable
      };
    });
  }
  buildColumns() {
    this.columnDefs = this.columns.map(col => {

      // ✅ Checkbox column
      if (col.type === 'checkbox') {
        return {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 50,
          filter: false,
        };
      }

      // ✅ Icon / IconClass column
      if (col.type === 'icon' || col.type === 'iconclass') {
        return {
          headerName: col.header,
          width: 90,
          // width: col.iconWidth || 90,
          sortable: col.sortable ?? false,
          filter: col.filterable ?? false,

          cellRenderer: (params: any) => {
            const icon = document.createElement('i');

            // 🔹 Icon class
            let iconClass = typeof col.iconClass === 'function'
              ? col.iconClass(params.data)
              : col.iconClass;

            iconClass = iconClass ? iconClass.replace('fa ', '').trim() : 'fa-eye';

            // 🔹 Color / Class
            const iconColor = typeof col.iconColor === 'function'
              ? col.iconColor(params.data)
              : col.iconColor;

            // ✅ Always set FA icon
            icon.className = `fa ${iconClass}`;

            // ✅ CONDITION ADDED HERE
            if (col.type === 'icon') {
              // 🎨 Direct color
              icon.style.color = iconColor || '#000';
            } else if (col.type === 'iconclass') {
              // 👕 Apply CSS class instead
              if (iconColor) {
                icon.classList.add(iconColor);
              }
            }

            // Common styles
            icon.style.cursor = 'pointer';
            icon.style.fontSize = `${col.iconSize ?? 16}px`;
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.height = '100%';

            // Tooltip
            if (col.tooltip) {
              icon.title = typeof col.tooltip === 'function'
                ? col.tooltip(params.data)
                : col.tooltip;
            }

            // Click
            icon.onclick = (e: any) => {
              e.stopPropagation();
              this.iconAction.emit({ row: params.data, column: col });
            };

            return icon;
          }
        };
      }
      // ✅ Text + Icon column
      if (col.type === 'texticon') {
        return {
          headerName: col.header,
          field: col.field,
          sortable: col.sortable ?? this.defaultSortable,
          filter: col.filterable ?? this.defaultFilterable,

          cellRenderer: (params: any) => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '6px';

            const text = document.createElement('span');
            text.innerText = params.value || '';

            const icon = document.createElement('i');

            // 🔹 icon class
            let iconClass = typeof col.iconClass === 'function'
              ? col.iconClass(params.data)
              : col.iconClass;

            iconClass = iconClass ? iconClass.replace('fa ', '').trim() : 'fa-car';
            icon.className = `fa ${iconClass}`;

            // 🔹 color or class
            const iconColor = typeof col.iconColor === 'function'
              ? col.iconColor(params.data)
              : col.iconColor;

            if (col.type === 'iconclass') {
              icon.classList.add(iconColor);
            } else {
              icon.style.color = iconColor || '#000';
            }

            icon.style.fontSize = `${col.iconSize ?? 14}px`;

            // ✅ position handling
            if (col.iconPosition === 'right') {
              container.appendChild(text);
              container.appendChild(icon);
            } else {
              container.appendChild(icon);
              container.appendChild(text);
            }

            return container;
          }
        };
      }
      // ✅ Text with CSS class (NO ICON)
      if (col.type === 'textclass') {
        return {
          headerName: col.header,
          field: col.field,
          sortable: col.sortable ?? this.defaultSortable,
          filter: col.filterable ?? this.defaultFilterable,

          cellRenderer: (params: any) => {
            const span = document.createElement('span');
            span.innerText = params.value || '';

            const className = typeof col.iconColor === 'function'
              ? col.iconColor(params.data)
              : col.iconColor;

            if (className) {
              span.classList.add(className); // ✅ apply color class
            }

            return span;
          }
        };
      }
      // ✅ Normal column
      return {
        headerName: col.header,
        field: col.field,
        sortable: col.sortable ?? this.defaultSortable,
        filter: col.filterable ?? this.defaultFilterable
      };
    });
  }
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };


  constructor(private fb: FormBuilder, public service: HomeService) {
    this.filterForm = this.fb.group({
      tracking: [false],
      fromDate: [''],
      toDate: ['']
    });
  }


}
