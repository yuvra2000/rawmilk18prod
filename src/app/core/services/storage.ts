// src/app/shared/services/storage.service.ts

import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface StorageChange {
  key: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));
  private storageChange$ = new Subject<StorageChange>();

  // --- Encapsulated Signal for tracking all keys (Your Excellent Idea!) ---
  private _storageKeys = signal<string[]>([]);
  public readonly storageKeys = this._storageKeys.asReadonly(); // Public readonly version

  constructor() {
    // Initialize keys on startup
    this.updateKeys();
  }

  setItem(key: string, value: any): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.storageChange$.next({ key, value });
      this.updateKeys(); // Update the list of all keys
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
    this.storageChange$.next({ key, value: null });
    this.updateKeys(); // Update the list of all keys
  }

  clear(): void {
    if (!this.isBrowser) return;
    localStorage.clear();
    this.storageChange$.next({ key: '__all__', value: null });
    this.updateKeys(); // Update the list of all keys
  }

  watchItem<T>(key: string): Observable<T | null> {
    return this.storageChange$.asObservable().pipe(
      filter(change => change.key === key),
      map(change => change.value as T | null)
    );
  }

  // Private method to refresh the keys signal
  private updateKeys(): void {
    if (!this.isBrowser) return;
    this._storageKeys.set(Object.keys(localStorage));
  }
}