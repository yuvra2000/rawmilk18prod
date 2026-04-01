import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error?.error?.Result === 'Session Expired due to new login.') {
        authService.signout();

        const sessionExpiredError = new HttpErrorResponse({
          error: {
            ...(error.error || {}),
            Message: error.error.Result,
            Result: error.error.Result,
          },
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url || undefined,
        });

        return throwError(() => sessionExpiredError);
      }
      return throwError(() => error);
    }),
  );
};
