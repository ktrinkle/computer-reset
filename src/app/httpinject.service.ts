import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private REST_API_SERVER = environment.api_url;

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        let currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser;
        const isApiUrl = request.url.startsWith(this.REST_API_SERVER);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }

        return next.handle(request);
    }
}
