// import {
//   ApplicationConfig,
//   importProvidersFrom,
//   provideZoneChangeDetection,
// } from '@angular/core';
// import { provideRouter, RouterOutlet } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { routes } from './app.routes';
// import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
// import { FlatpickrModule } from 'angularx-flatpickr';
// import { MaterialModuleModule } from './material-module/material-module.module';
// import { ToastrModule } from 'ngx-toastr';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './shared/interceptors/auth.interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideHttpClient(withInterceptors([authInterceptor])),
//     provideRouter(routes),

//     RouterOutlet,
//     provideCharts(withDefaultRegisterables()),
//     MaterialModuleModule,
//     importProvidersFrom(
//       BrowserAnimationsModule,
//       FlatpickrModule.forRoot(),
//       ToastrModule.forRoot({
//         timeOut: 5000, // 5 seconds
//         closeButton: true,
//         progressBar: true,
//       }),
//     ),
//   ],
// };

import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MaterialModuleModule } from './material-module/material-module.module';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

// ✅ ADD THIS
import { provideEcharts } from 'ngx-echarts';
// import { provideEcharts } from 'ngx-echarts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),

    RouterOutlet,

    provideCharts(withDefaultRegisterables()),
    MaterialModuleModule,

    // ✅ ADD HERE
    // provideEcharts({
    //   echarts: () => import('echarts')
    // }),
    provideEcharts(),
    importProvidersFrom(
      BrowserAnimationsModule,
      FlatpickrModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
      }),
    ),
  ],
};
