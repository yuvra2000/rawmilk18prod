// 1. Custom Filter Component
// filters/custom-filter.component.ts
import { Component, ViewChild, AfterViewInit, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-filter',
  standalone: true, // 2. Add standalone flag
  imports: [ FormsModule ], // 3. Import FormsModule here

  template: `
    <div class="custom-filter">
      <div class="filter-section">
        <label class="filter-label">Filter Type:</label>
        <select class="filter-select" [(ngModel)]="filterType" (change)="onFilterTypeChange()">
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </div>
      
      <div class="filter-section">
        <label class="filter-label">Value:</label>
        <input 
          class="filter-input"
          type="text" 
          [(ngModel)]="filterValue" 
          (input)="onFilterValueChange()"
          placeholder="Enter filter value...">
      </div>
      
      <div class="filter-actions">
        <button class="filter-btn primary" (click)="applyFilter()">Apply</button>
        <button class="filter-btn secondary" (click)="clearFilter()">Clear</button>
      </div>
    </div>
  `,
  styles: [`
    .custom-filter {
      padding: 12px;
      min-width: 200px;
    }

    .filter-section {
      margin-bottom: 12px;
    }

    .filter-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 4px;
    }

    .filter-select,
    .filter-input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 13px;
    }

    .filter-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .filter-btn {
      flex: 1;
      padding: 6px 12px;
      border: 1px solid;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;

      &.primary {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
      }

      &.secondary {
        background: white;
        border-color: #e2e8f0;
        color: #64748b;
      }
    }
  `]
})
export class CustomFilterComponent implements IFilterAngularComp, AfterViewInit {
  @ViewChild('input', { read: ViewContainerRef }) input!: ViewContainerRef;

  params!: IFilterParams;
  filterType = 'contains';
  filterValue = '';

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  ngAfterViewInit(): void {
    // Focus input after view init
    setTimeout(() => {
      if (this.input) {
        const inputElement = this.input.element.nativeElement.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }
    });
  }

  isFilterActive(): boolean {
    return this.filterValue !== '';
  }

 doesFilterPass(params: any): boolean {
  const { node }:any = params;
  // ✅ Correctly use the valueGetter from the method's own 'params'
  const value = params.valueGetter(node)?.toString().toLowerCase() || ''; 
  const filterValue = this.filterValue.toLowerCase();

  switch (this.filterType) {
    case 'contains':
      return value.includes(filterValue);
    case 'equals':
      return value === filterValue;
    case 'startsWith':
      return value.startsWith(filterValue);
    case 'endsWith':
      return value.endsWith(filterValue);
    default:
      return true;
  }
}

  getModel(): any {
    if (!this.isFilterActive()) {
      return null;
    }

    return {
      type: this.filterType,
      filter: this.filterValue
    };
  }

  setModel(model: any): void {
    if (model) {
      this.filterType = model.type || 'contains';
      this.filterValue = model.filter || '';
    } else {
      this.clearFilter();
    }
  }

  onFilterTypeChange(): void {
    this.params.filterChangedCallback();
  }

  onFilterValueChange(): void {
    this.params.filterChangedCallback();
  }

  applyFilter(): void {
    this.params.filterChangedCallback();
  }

  clearFilter(): void {
    this.filterType = 'contains';
    this.filterValue = '';
    this.params.filterChangedCallback();
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    if (params?.suppressFocus) {
      return;
    }
    
    setTimeout(() => {
      const inputElement = document.querySelector('.filter-input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    });
  }
}