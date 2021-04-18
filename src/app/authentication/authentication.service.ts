import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { jwt } from '../data';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<string>;
    public currentUser: Observable<string>;
    private REST_API_SERVER = environment.api_url;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem('apiToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): string {
        this.currentUserSubject.next(sessionStorage.getItem('apiToken'));
        return this.currentUserSubject.value;
    }

    public checkJwtExpired(token?: string): boolean {
      if (!token) {
        return true;
      }

      const decoded: jwt = jwt_decode(token);

      if (decoded.exp === undefined) {
        return true;
      }

      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return !(date.valueOf() > new Date().valueOf());
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('apiToken');
        this.currentUserSubject.next(null);
    }
}
