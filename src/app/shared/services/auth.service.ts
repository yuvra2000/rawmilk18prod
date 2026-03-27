import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly VALID_EMAIL = 'spruko@admin.com';
  private readonly VALID_PASSWORD = 'sprukoadmin';

  public showLoader: boolean = false;
  private _isLoggedIn = false;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

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

  Access(data: any) {
    // https://api.secutrak.in/dev-app-secutrak
    // return this.http.post('https://api-secutrak.secutrak.in/dev-app-secutrak/loginByAccessTokenV2', data);
    return this.http.post(
      'https://apinode1.secutrak.in/dev-app-secutrak/loginByAccessTokenV2',
      data,
    );
    // return this.http.post('https://api.secutrak.in/dev-app-secutrak/loginByAccessTokenV2', data);
  }
  signout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/auth/login']);
  }
  login(formData: any): any {
    return this.http.post(`${environment.loginAPI}/loginV2`, formData);
  }
}
