import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MaterialModuleModule } from './material-module/material-module.module';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),RouterOutlet,
    provideCharts(withDefaultRegisterables()),
    MaterialModuleModule,
    importProvidersFrom(
      BrowserAnimationsModule,
      FlatpickrModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 15000, // 15 seconds
        closeButton: true,  
        progressBar: true,
      }),
    ),
   
  ]
};
