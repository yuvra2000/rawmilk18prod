import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSource = new BehaviorSubject<string>('light');
  theme$ = this.themeSource.asObservable();

  setTheme(theme: string) {
    this.themeSource.next(theme);
  }
  constructor() { }
}
