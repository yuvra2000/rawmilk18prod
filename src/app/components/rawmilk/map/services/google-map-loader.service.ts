import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapLoaderService {
  private loaded = false;

  load(): Promise<void> {
    return new Promise((resolve) => {
      if (this.loaded) return resolve();

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,drawing`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.loaded = true;
        resolve();
      };

      document.body.appendChild(script);
    });
  }
}