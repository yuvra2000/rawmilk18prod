import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Option } from './types';

@Component({
  selector: 'app-color-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  template: `
    <ng-select
      class="ng-select custom-placeholder-style"
      [formControl]="control()"
      [id]="fieldName()"
      [items]="options()"
      bindLabel="name"
      bindValue="id"
      [clearable]="true"
      [placeholder]="placeholder()"
      [required]="required()"
      virtualScroll="true"
    >
      <ng-template ng-label-tmp let-item="item">
        <div class="d-flex align-items-center gap-2">
          <span
            [style.background]="item.id"
            [style.width]="colorWidth()"
            style=" height: 20px; border-radius: 3px; display: inline-block; border: 1px solid #ccc;"
          >
          </span>
          <!-- <span>{{ item.name }}</span> -->
        </div>
      </ng-template>

      <ng-template ng-option-tmp let-item="item">
        <div class="d-flex align-items-center gap-2">
          <span
            [style.background]="item.id"
            [style.width]="optionColorWidth()"
            style=" height: 20px; border-radius: 3px; display: inline-block; border: 1px solid #ccc;"
          >
          </span>
          <!-- <span>{{ item.name }}</span> -->
        </div>
      </ng-template>
    </ng-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSelectFieldComponent {
  control = input.required<FormControl>();
  fieldName = input.required<string>();
  placeholder = input<string>('Select Color');
  required = input<boolean>(false);
  options = input<Option[]>([]);
  // ✅ Default width ab 100% set kar di gayi hai
  colorWidth = input<string>('130px');
  optionColorWidth = input<string>('100%');
}
