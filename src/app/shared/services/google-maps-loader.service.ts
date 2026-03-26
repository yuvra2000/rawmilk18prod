import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

// Define a type for the possible loading states for better type safety.
export type MapsLoadingState = 'initial' | 'loading' | 'loaded' | 'error';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private apiKey = environment.googleMapsApiKey;
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // --- Use a signal to track and broadcast the current loading state ---
  public readonly loadingState = signal<MapsLoadingState>('initial');

  // The promise remains the core of the "load once" logic.
  private scriptLoadingPromise: Promise<void> | null = null;

  load(): Promise<void> {
    // Only run in the browser
    if (!this.isBrowser) {
      return Promise.resolve();
    }

    // If already loaded, return a resolved promise immediately.
    if (this.loadingState() === 'loaded') {
      return Promise.resolve();
    }

    // If currently loading, return the existing promise.
    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    // --- Start the loading process ---
    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      // Update the state signal to 'loading'
      this.loadingState.set('loading');
      console.log('Loading Google Maps API script...');

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=geometry,places,drawing`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // On success, update the state to 'loaded' and resolve the promise.
        this.loadingState.set('loaded');
        console.log('Google Maps API loaded successfully.');
        resolve();
      };

      script.onerror = (err) => {
        // On error, update the state to 'error', reset the promise, and reject.
        this.loadingState.set('error');
        this.scriptLoadingPromise = null; // Allow retry on failure
        console.error('Google Maps API failed to load.', err);
        reject(err);
      };

      document.body.appendChild(script);
    });

    return this.scriptLoadingPromise;
  }
}
