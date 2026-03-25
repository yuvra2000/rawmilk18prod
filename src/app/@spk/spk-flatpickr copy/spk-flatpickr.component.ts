import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect'; // Plugin import zaroori hai

@Component({
  selector: 'spk-flatpickr',
  standalone: true,
  imports: [FlatpickrModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SpkFlatpickrComponent),
      multi: true,
    },
  ],
  styleUrl: './spk-flatpickr.component.scss',
  template: `
    <input
      #flatpickrElement
      type="text"
      class="form-control spk-input"
      [class]="class()"
      [placeholder]="placeholder()"
      mwlFlatpickr
      [(ngModel)]="value"
      [altFormat]="computedAltFormat()"
      [altInput]="altInput()"
      [convertModelValue]="true"
      [enableTime]="enableTime()"
      [noCalendar]="noCalendar()"
      [dateFormat]="computedDateFormat()"
      [minDate]="computedMinDate()"
      [maxDate]="computedMaxDate()"
      [mode]="mode()"
      [plugins]="computedPlugins()"
      (flatpickrChange)="onDateChange($event)"
    />
  `,
})
export class SpkFlatpickrComponent implements ControlValueAccessor, OnDestroy {
  // ✅ Input Signals
  placeholder = input<string>('Select Date');
  class = input<string>('');
  dateFormat = input<string>('Y-m-d');
  altInput = input<boolean>(true);
  enableTime = input<boolean>(false);
  noCalendar = input<boolean>(false);
  minDate = input<any>(null);
  maxDate = input<any>(null);
  mode = input<'single' | 'range' | 'multiple'>('single');

  // ✅ Re-added the missing 'type' signal
  type = input<'date' | 'month' | 'year'>('date');

  value: any = null;
  flatpickrInput = viewChild<ElementRef>('flatpickrElement');

  // ✅ Computed Plugins: Type ke basis par automatic plugin set karega
  computedPlugins = computed(() => {
    if (this.type() === 'month') {
      return [monthSelectPlugin({ shorthand: false, dateFormat: 'F Y' })];
    }
    return [];
  });

  computedAltFormat = computed(() => {
    if (this.type() === 'month') return 'F Y';
    if (this.type() === 'year') return 'Y';
    // Logistics standard: 10-02-2026
    return 'd-m-Y';
  });
  // ✅ Computed Date Format: Type ke basis par format change karega
  computedDateFormat = computed(() => {
    if (this.type() === 'month') return 'F Y';
    if (this.type() === 'year') return 'Y';
    return this.dateFormat();
  });
  // ✅ Computed Min Date: String ko Date object mein safely convert karega
  computedMinDate = computed(() => {
    const min = this.minDate();
    if (!min) return '';
    return new Date(min); // "YYYY-MM-DD" string ko Date mein badal dega
  });

  // ✅Computed Max Date: String ko Date object mein safely convert karega
  computedMaxDate = computed(() => {
    const max = this.maxDate();
    if (!max) return '';
    return new Date(max); // "YYYY-MM-DD" string ko Date mein badal dega
  });

  onChange: any = () => {};
  onTouched: any = () => {};

  // ✅ Method to open/close from parent icon
  toggle() {
    const instance = (this.flatpickrInput()?.nativeElement as any)?._flatpickr;
    if (instance) instance.toggle();
  }

  writeValue(val: any): void {
    this.value = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(event: any) {
    const val =
      this.mode() === 'single' ? event.selectedDates[0] : event.selectedDates;
    this.onChange(val);
  }
  ngOnDestroy() {
    const nativeElement = this.flatpickrInput()?.nativeElement;

    // 1. Flatpickr Instance ko pakdein
    const instance = (nativeElement as any)?._flatpickr;

    if (instance) {
      console.log('🗑️ Spk-Flatpickr: Deep Cleanup initiated...');

      // 🚨 AGGRESSIVE CLEANUP:
      // Flatpickr ke internal listeners aur plugins ko pehle saaf karein
      if (instance.config) {
        instance.config.onChange = [];
        instance.config.onClose = [];
        instance.config.onDestroy = [];
      }

      // 2. Instance ko destroy karein (ye DOM nodes hatayega)
      instance.destroy();

      // 3. Alt-Input Ghost Cleanup:
      // Flatpickr jab altInput true hota hai, toh ek '.flatpickr-input' class wala input chhod deta hai
      if (this.altInput()) {
        const altInput = nativeElement?.nextSibling;
        if (altInput && altInput.classList?.contains('flatpickr-input')) {
          altInput.remove();
        }
      }

      // 4. Memory Purge: Native element se reference delete karein
      // Taki GC (Garbage Collector) ise collect kar sake
      delete (nativeElement as any)._flatpickr;
    }

    // 5. Angular Bridge Cleanup:
    // ControlValueAccessor ke links todhein
    this.onChange = () => {};
    this.onTouched = () => {};
    this.value = null;

    // 6. ViewChild Nullification
    (this as any).flatpickrInput = null;

    console.log('📅 Spk-Flatpickr: Memory fully purged.');
  }
}
