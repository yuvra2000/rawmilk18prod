import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// A type for your endpoint keys for better autocompletion and safety
// export type ApiEndpoint = keyof typeof environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private http = inject(HttpClient);

  /**
   * Intelligently sets headers. It does NOT set Content-Type for FormData,
   * allowing the browser to set it with the correct boundary for file uploads.
   */
  private getHeaders(data: any): HttpHeaders {
    if (data instanceof FormData) {
      return new HttpHeaders();
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  /**
   * Gets a full API URL from the environment configuration.
   * @param key The key of the endpoint (e.g., 'tms', 'base').
   * @returns The full base URL as a string.
   */
  public getEndpoint(key: any): string {
    return environment.BASE_URL[key];
  }

  get<T>(url: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, data: any, options: any = {}): Observable<T> {
    return this.http.post<T>(url, data, {
      headers: options.headers || this.getHeaders(data),
      ...options, // 👈 Taaki hum responseType: 'blob' pass kar sakein
    }) as Observable<T>;
  }

  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(url, data, {
      headers: this.getHeaders(data),
    });
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
