import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiUser } from '../data';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<ApiUser>;
    public currentUser: Observable<ApiUser>;
    private REST_API_SERVER = "https://computerresetliquidation.azurewebsites.net";

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<ApiUser>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): ApiUser {
        //console.log(this.currentUserSubject.value);
        return this.currentUserSubject.value;
    }

    loginApi(username: string, password: string) {
      var url = this.REST_API_SERVER + '/users/authenticate';

        return this.http.post<any>(url, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}