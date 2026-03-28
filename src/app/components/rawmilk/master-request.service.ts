import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

export interface HttpOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json'; // Explicitly set to json for better typing
    withCredentials?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class MasterRequestService {
    constructor(private http: HttpClient) { }

    private getHttpOptions(): HttpOptions {
        const token = localStorage.getItem('AccessToken');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return { headers };
    }

    post<T>(endpoint: string, payload: any, defaultUrl: boolean = false): Observable<T> {
        const filteredPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v != null)
        );
        const url = defaultUrl ? endpoint : environment.BASE_URL + endpoint;
        return this.http.post<T>(url, filteredPayload, this.getHttpOptions());
    }

    patch<T>(endpoint: string, payload: any = null): Observable<T> {
        return this.http.patch<T>(
            environment.BASE_URL + endpoint,
            payload,
            this.getHttpOptions()
        );
    }

    put<T>(endpoint: string, payload: any = null): Observable<T> {
        return this.http.put<T>(
            environment.BASE_URL + endpoint,
            payload,
            this.getHttpOptions()
        );
    }

    get<T>(endpoint: string, params: any = {}, defaultUrl: boolean = false): Observable<T> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        const url = defaultUrl ? endpoint : environment.BASE_URL + endpoint;
        return this.http.get<T>(url, { ...this.getHttpOptions(), params: httpParams });
    }

    delete<T>(endpoint: string, params: any = {}, defaultUrl: boolean = false): Observable<T> {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        const url = defaultUrl ? endpoint : environment.BASE_URL + endpoint;
        return this.http.delete<T>(url, { ...this.getHttpOptions(), params: httpParams });
    }
}