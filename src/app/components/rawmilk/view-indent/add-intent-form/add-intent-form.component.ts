import { Component, signal } from '@angular/core';
import {
  FieldConfig,
  FilterFormComponent,
} from '../../../../shared/components/filter-form/filter-form.component';
import {
  FormModalComponent,
  FormModalConfig,
} from '../../../../shared/components/reusable-modal/shared/form-modal/form-modal.component';

@Component({
  selector: 'app-add-intent-form',
  standalone: true,
  imports: [FilterFormComponent, FormModalComponent],
  templateUrl: './add-intent-form.component.html',
  styleUrl: './add-intent-form.component.scss',
})
export class AddIntentFormComponent {
  addIndentFormFields = signal<FieldConfig[]>([
    {
      label: 'Intent Name',
      name: 'intentName',
      type: 'text',
      class: 'col-md-6',
    },
    {
      label: 'Intent Name',
      name: 'intentName',
      type: 'text',
      class: 'col-md-6',
    },
    {
      label: 'Intent Name',
      name: 'intentName',
      type: 'text',
      class: 'col-md-6',
    },
    {
      label: 'Intent Name',
      name: 'intentName',
      type: 'text',
      class: 'col-md-6',
    },
  ]);
  onFormSubmit(formData: any) {
    console.log('Form Data:', formData);
    // Here you can handle the form submission, e.g., send data to the server
    // For now, we just log it to the console}
  }
}
