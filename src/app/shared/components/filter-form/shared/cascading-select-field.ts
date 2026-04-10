import {
  Component,
  EventEmitter,
  effect,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Option, SelectConfig } from './types';

@Component({
  selector: 'app-cascading-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  template: `
    <ng-select
      class="ng-select custom-placeholder-style"
      [formControl]="control()"
      [id]="fieldName()"
      [items]="enhancedOptions()"
      [bindLabel]="bindLabel()"
      [clearable]="true"
      [multiple]="multiple()"
      [placeholder]="placeholder()"
      [required]="required()"
      virtualScroll="true"
      [isOpen]="isOpen()"
      [addTag]="resolvedAddTag()"
      [addTagText]="addTagText()"
      (change)="onSelectChange($event)"
    >
    </ng-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CascadingSelectFieldComponent {
  control = input.required<FormControl>();
  fieldName = input.required<string>();
  placeholder = input<string>('Select...');
  multiple = input<boolean>(false);
  bindLabel = input<string>('name');
  required = input<boolean>(false);
  isOpen = input<boolean | undefined>(false);
  options = input<Option[]>([]);
  // @Output() selectionChange = new EventEmitter<any>();
  selectionChange = output<EventEmitter<any>>();
  addTag = input<boolean | ((term: string) => any)>(false);
  addTagText = input<string>('Add item');
  showSelectAll = input<boolean>(true);
  selectConfig = input<SelectConfig | undefined>({
    enableExclusiveAll: false,
    allOptionValue: 'all',
  });
  enhancedOptions = computed(() => {
    const opts = this.options();

    if (!this.multiple() || !this.showSelectAll() || opts.length === 0) {
      return opts;
    }

    const actionOptions: Option[] = [
      {
        id: 'SELECT_ALL',
        name: ' Select All',
        isAction: true,
      } as any,
      {
        id: 'CLEAR_ALL',
        name: 'Clear All',
        isAction: true,
      } as any,
    ];

    return [...actionOptions, ...opts];
  });
  // ✅ Computed: Decides which addTag function to use
  resolvedAddTag = computed(() => {
    const config = this.addTag();
    const bLabel = this.bindLabel();

    // 1. If parent provided a custom function, use it
    if (typeof config === 'function') {
      return config;
    }

    // 2. If parent passed 'true', use the DEFAULT internal logic
    // Returns: { id: term, name: term, tag: true }
    if (config === true) {
      return (term: string) => ({ name: term, [bLabel]: term, tag: true });
    }

    // 3. Otherwise disabled
    return false;
  });
  constructor() {
    // ✅ Control value change hone pe emit karo
    effect(() => {
      // ✅ FIX: Options ki value ko constructor ki jagah effect mein check karo
      const optionsArray = this.options();
      // console.log(`[${this.fieldName()}] Options received: ${optionsArray.length} items ${this.bindLabel()}`);

      // Agar aapko options array ki length 0 se zyada dikh rahi hai (e.g., 43 items)
      // Toh data sahi hai!
    });
    effect(() => {
      const value = this.control().value;
      // console.log(value,"hii");
      if (value !== null && value !== undefined) {
        this.selectionChange.emit(value);
      }
    });
  }

  onSelectChange(selectedItems: any[]) {
    const config = this.selectConfig();
    const bLabel = this.bindLabel();
    // Feature check
    if (
      !this.multiple() ||
      !config?.enableExclusiveAll ||
      !Array.isArray(selectedItems) ||
      selectedItems.length <= 1
    ) {
      return;
    }

    const allLabelName = config.allOptionValue; // E.g., 'All'

    // ✅ Helper: Object ke andar label field check karega
    const isItemAll = (item: any) => {
      const labelValue = item && typeof item === 'object' ? item[bLabel] : item;
      return labelValue === allLabelName;
    };

    const hasAll = selectedItems.some((item) => isItemAll(item));

    if (hasAll) {
      const lastSelectedItem = selectedItems[selectedItems.length - 1];

      if (isItemAll(lastSelectedItem)) {
        // Case A: User ne 'All' click kiya -> Poora Object set karo
        this.control().setValue([lastSelectedItem]);
      } else {
        // Case B: 'All' pehle se tha, naya item select kiya -> 'All' object filter kardo
        const filteredObjects = selectedItems.filter(
          (item) => !isItemAll(item),
        );
        this.control().setValue(filteredObjects);
      }
    }
  }
}
