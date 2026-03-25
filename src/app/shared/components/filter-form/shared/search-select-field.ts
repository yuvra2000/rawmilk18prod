import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  Injector,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';
import { Option } from './types';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  template: `
    <ng-select
      [items]="options()"
      [loading]="loading()"
      [clearable]="true"
      [formControl]="control()"
      (search)="onSearch($event.term)"
      [id]="fieldName()"
      [bindLabel]="bindLabel()"
      [placeholder]="placeholder()"
      [required]="required()"
      [multiple]="multiple()"
      virtualScroll="true"
      class="ng-select custom-placeholder-style custom-multiselect"
    >
    </ng-select>
    @if (error()) {
      <span
        class="text-danger"
        style="font-size: 11px; position: absolute !important"
      >{{ error() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchSelectFieldComponent {
  // Inputs (yours + clearable as input if needed)
  control = input.required<FormControl>();
  fieldName = input.required<string>();
  searchFn = input.required<(query: string) => Observable<Option[]>>();
  placeholder = input<string>('Search...');
  required = input<boolean>(false);
  bindLabel = input<string>('name');
  multiple = input<boolean>(false);
  initialOptions = input<Option[]>([]);
  minLength = input<number>(2);

  // Outputs
  searchResults = output<Option[]>();
  searchError = output<string>();

  // Signals
  private querySignal = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private searchResultSignal;
  options;

  constructor(private injector: Injector) {  // For interop context
  this.searchResultSignal = toSignal(
    toObservable(this.querySignal, { injector: this.injector }).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { 
        this.loading.set(true); 
        this.error.set(null); 
      }),
      switchMap(query => {
        if (!query || query.length < this.minLength()) return of(this.initialOptions());
        return this.searchFn()(query).pipe(
          catchError(err => {
            const errorMsg = 'Search failed.';
            this.error.set(errorMsg);
            this.searchError.emit(errorMsg);
            return of([]);
          })
        );
      }),
      tap((results) => {
        this.loading.set(false);
        // ✅ SAHI TAREEKA: Emission yahan karein
        this.searchResults.emit(results); 
      })
    ),
    { initialValue: this.initialOptions(), injector: this.injector }
  );

  // ✅ Computed ko "Pure" rakhein (Sirf value return karein)
  this.options = computed(() => this.searchResultSignal());
  }

  onSearch(query: string): void {
    this.querySignal.set(query);
  }
}