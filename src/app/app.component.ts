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

// import { Component, inject } from '@angular/core';
// import {
//   NavigationCancel,
//   NavigationEnd,
//   NavigationError,
//   Router,
//   RouterOutlet,
// } from '@angular/router';
// import { AppStateService } from './shared/services/app-state.service';
// import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
// import { filter } from 'rxjs';
// import { NgSelectConfig } from '@ng-select/ng-select';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, NgxSpinnerComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })
// export class AppComponent {
//   private router = inject(Router);
//   private spinner = inject(NgxSpinnerService);
//   private appState = inject(AppStateService);
//   private ngSelectConfig = inject(NgSelectConfig);

//   title = 'zynix';
//   constructor() {
//     this.ngSelectConfig.appendTo = 'body'; // ✅ Default for all ng-selects

//     this.appState.updateState();
//     this.router.events
//       .pipe(
//         filter(
//           (event) =>
//             event instanceof NavigationEnd ||
//             event instanceof NavigationError ||
//             event instanceof NavigationCancel,
//         ),
//       )
//       .subscribe(() => {
//         this.spinner.hide();
//       });
//   }
// }
// src/app/app.component.ts (Advanced)

// import { Component, inject, signal } from '@angular/core';
// import {
//   Router,
//   RouterOutlet,
//   NavigationStart,
//   NavigationEnd,
//   NavigationError,
//   NavigationCancel,
// } from '@angular/router';
// import {
//   NgxSpinnerComponent,
//   NgxSpinnerService,
//   NgxSpinnerModule,
// } from 'ngx-spinner';
// import { NgSelectConfig } from '@ng-select/ng-select';
// import { filter } from 'rxjs/operators';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { AppStateService } from './shared/services/app-state.service';
// import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// import { CommonModule } from '@angular/common';

// ModuleRegistry.registerModules([AllCommunityModule]);
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, NgxSpinnerComponent, NgxSpinnerModule, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })
// export class AppComponent {
//   private readonly router = inject(Router);
//   private readonly spinner = inject(NgxSpinnerService);
//   private readonly appState = inject(AppStateService);
//   private readonly ngSelectConfig = inject(NgSelectConfig);

//   // SIGNAL-BASED STATE: Track loading
//   protected readonly isNavigating = signal(false);
//   constructor() {
//     this.ngSelectConfig.appendTo = 'body';
//     this.ngSelectConfig.notFoundText = 'No items found';

//     this.setupNavigationSpinner();
//     this.appState.updateState();
//   }

//   private setupNavigationSpinner(): void {
//     let navigationTimer: any;

//     // Show spinner on navigation start
//     this.router.events
//       .pipe(
//         filter((event) => event instanceof NavigationStart),
//         takeUntilDestroyed(),
//       )
//       .subscribe(() => {
//         // ✅ DEBOUNCE: Only show spinner if navigation takes > 200ms
//         navigationTimer = setTimeout(() => {
//           this.isNavigating.set(true);
//           // this.spinner.show();
//         }, 200);
//       });

//     // Hide spinner on navigation complete
//     this.router.events
//       .pipe(
//         filter(
//           (event) =>
//             event instanceof NavigationEnd ||
//             event instanceof NavigationError ||
//             event instanceof NavigationCancel,
//         ),
//         takeUntilDestroyed(),
//       )
//       .subscribe((event) => {
//         // ✅ CLEANUP: Clear timer if navigation completes quickly
//         clearTimeout(navigationTimer);

//         this.isNavigating.set(false);
//         this.spinner.hide();

//         if (event instanceof NavigationError) {
//           console.error('Navigation error:', event.error);
//           // Optional: Show error toast
//           // this.toastr.error('Navigation failed. Please try again.');
//         }
//       });
//   }
// }
