import { Component } from '@angular/core';
import {
  NavTabComponent,
  TabConfig,
} from '../../../../shared/components/nav-tab/nav-tab.component';
import { AddIntentFormComponent } from '../add-intent-form/add-intent-form.component';
import { UploadIntentFormComponent } from '../upload-intent-form/upload-intent-form.component';

@Component({
  selector: 'app-add-intent-modal',
  standalone: true,
  imports: [NavTabComponent],
  templateUrl: './add-intent-modal.component.html',
  styleUrl: './add-intent-modal.component.scss',
})
export class AddIntentModalComponent {
  tabList: TabConfig[] = [
    { title: 'Add Intent', component: AddIntentFormComponent },
    { title: 'Upload', component: UploadIntentFormComponent },
  ];
}
