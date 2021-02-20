import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './../../environments/environment';

import { ApiUser } from '../data';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<ApiUser>;
    public currentUser: Observable<ApiUser>;
    private REST_API_SERVER = environment.api_url;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem('apiToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): ApiUser {
        //console.log(this.currentUserSubject.value);
        return this.currentUserSubject.value;
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
