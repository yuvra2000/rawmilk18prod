import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';

@Injectable({
    providedIn: 'root',
})

export class MasterRequestService {
    headers: any;
    constructor(private http: HttpClient) { }

    getHeader() {
        const token = localStorage.getItem('AccessToken');
        if (token !== '') {
            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });
            this.headers = { headers: headers };
        }
    }

    post(endpoint: string, payload: any, defaultUrl: boolean = false) {
        const filteredPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v != null)
        );
        if (defaultUrl === true) {
            return this.http.post(
                endpoint,
                filteredPayload,
                this.headers
            )
        }
        return this.http.post(
            environment.BASE_URL + endpoint,
            filteredPayload,
            this.headers
        );
    }

    patch(endpoint: string, payload: any = null) {
        return this.http.patch(
            environment.BASE_URL + endpoint, payload, this.headers
        )
    }

    put(endpoint: string, payload: any = null) {
        // debugger;
        return this.http.put(
            environment.BASE_URL + endpoint,
            payload,
            this.headers
        );
    }

    get(endpoint: string, params: any = {}, defaultUrl: boolean = false) {
        // debugger;
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        if (defaultUrl === true) {
            return this.http.get(
                endpoint,
                { ...this.headers, params: httpParams }
            )
        }
        return this.http.get(
            environment.BASE_URL + endpoint,
            { ...this.headers, params: httpParams }
        );
    }

    delete(endpoint: string, params: any = {}, defaultUrl: boolean = false) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        if (defaultUrl === true) {
            return this.http.delete(
                endpoint,
                { ...this.headers, params: httpParams }
            )
        }
        return this.http.delete(
            environment.BASE_URL + endpoint,
            { ...this.headers, params: httpParams }
        );
    }

}