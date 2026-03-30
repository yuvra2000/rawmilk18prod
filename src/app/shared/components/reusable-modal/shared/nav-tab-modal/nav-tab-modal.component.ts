import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, signal, model, Type, computed } from '@angular/core';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ReusableModalComponent } from '../../reusable-modal.component';

export interface TabConfig {
  title: string;
  content?: string;
  component?: Type<any>;
  componentInputs?: { [key: string]: any };
}

@Component({
  selector: 'app-nav-tabs-modal',
  standalone: true,
  imports: [
    NgbNavModule,
    NgComponentOutlet,
    NgbModule,
    CommonModule,
    ReusableModalComponent,
  ],
  templateUrl: './nav-tab-modal.component.html', // ✅ Reuse same template
  styleUrl: './nav-tab-modal.component.scss',
})
export class NavTabsModalComponent {
  tabs = signal<TabConfig[]>([]);
  computedTabs = computed(() => {
    // console.log(this.tabs()?.componentInputs);
    return this.tabs();
  });
  active = model<number>(0);
  modalTitle = signal<string>('');
}
