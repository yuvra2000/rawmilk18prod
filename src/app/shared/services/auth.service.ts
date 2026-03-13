import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly VALID_EMAIL = 'spruko@admin.com';
  private readonly VALID_PASSWORD = 'sprukoadmin';

  public showLoader: boolean = false;
  private _isLoggedIn = false;

  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return this._isLoggedIn || !!localStorage.getItem('isLoggedIn');
  }

  loginWithEmail(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
        this._isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        resolve();
      } else {
        reject({ name: 'AuthError', message: 'Invalid email or password.' });
      }
    });
  }

  signout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/auth/login']);
  }
}
