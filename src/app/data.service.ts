import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UserRetrieve, Timeslot, Signup, StateList, CityList, UserModel, ApiUser } from './data';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public eventIdPass: number;

  public userFull: UserModel;

  private REST_API_SERVER = "https://computerresetliquidation.azurewebsites.net";
  //private REST_API_SERVER = "";

  constructor(private httpClient: HttpClient) { }

  public callToken(): any {
    return sessionStorage.get('accessToken');
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
  /** GET - gets Azure Auth info from Facebook for UI to parse */
    public getAzureAuth() {
      var url = '/.auth/me';
      return this.httpClient.get(url);
    }
    
    public getUserInfo(id: string): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/attrib/' + encodeURIComponent(id) + '';
      //console.log(this.userSmall);
      return this.httpClient.get(url);
    }

    public getEvent(){
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/open';
      return this.httpClient.get(url);
    }

    public getState(): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/ref/state';
      return this.httpClient.get(url);
    }

    public getCity(stateCd: string): any {
      let url = this.REST_API_SERVER + '/api/computerreset/api/ref/citylist/' + encodeURIComponent(stateCd) + '';
      return this.httpClient.get(url);
    }

    public signupForEvent(eventReq: Signup): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signup';
      return this.httpClient.post(url, eventReq, {responseType: 'text'});


    }
}