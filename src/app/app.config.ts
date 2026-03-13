import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MaterialModuleModule } from './material-module/material-module.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),RouterOutlet,
    provideCharts(withDefaultRegisterables()),
    MaterialModuleModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireModule,
    importProvidersFrom(
      BrowserAnimationsModule,
      FlatpickrModule.forRoot(),
      AngularFireModule.initializeApp(environment.firebase),
      ToastrModule.forRoot({
        timeOut: 15000, // 15 seconds
        closeButton: true,  
        progressBar: true,
      }),
    ),
   
  ]
};
