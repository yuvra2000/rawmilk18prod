import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStateService } from './shared/services/app-state.service';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import {
  NgxSpinnerComponent,
  NgxSpinnerService,
  NgxSpinnerModule,
} from 'ngx-spinner';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'zynix';
  private spinner = inject(NgxSpinnerService);
  constructor(private appState: AppStateService) {
    this.appState.updateState();
  }
}
