import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { UserSmall, Signup, UserModel, UserEventSignup, UserEventDayOf, UserEventNote, Timeslot } from './data';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public eventIdPass: number;

  public userFull: UserModel = {id: 0, firstName: null, lastName: null, cityName: null,
    stateCode: null, realName: null, facebookId: null, adminFlag: false, volunteerFlag: false};

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
    
    public getUserInfo(userReq: UserSmall): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/attrib/';
      //console.log(this.userSmall);
      return this.httpClient.post(url, userReq);
    }
    
    public updateUserNote(userNote: UserEventNote): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signup/note';
      var apirtn = this.httpClient.post(url, userNote, {responseType: 'text'}).toPromise();
      //console.log(apirtn);
      return apirtn;
    }

    //modified to show in DFW local at all times
    public getEvent(facebookId: string){
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/open/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.get(url);
    }

    public getEventFuture(facebookId: string) {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/upcoming/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.get(url);
    }

    public getEventPast(facebookId: string) {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/past/' + encodeURIComponent(facebookId) + '';
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

    public updateEvent(eventInfo: Timeslot): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/create';
      return this.httpClient.post(url, eventInfo, {responseType : 'text'});
    }

    public getSignedUpUsers(eventId: number, facebookId: string ): Promise<UserEventSignup[]> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/' + encodeURIComponent(eventId) + '/'
      + '999/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.get<UserEventSignup[]>(url).toPromise();
    }

    public getSignupDayOf(eventId: number, facebookId: string ): Promise<UserEventDayOf[]> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/' + encodeURIComponent(eventId) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.get<UserEventDayOf[]>(url).toPromise();
    }

    public async sendUserSlot(id: number, attendNbr: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(attendNbr) + '/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async sendUserConfirm(id: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/confirm/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }
    
    public async sendUserAttend(id: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/attended/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async sendNoShow(id: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/noshow/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changeEventState(id: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/close/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changePrivateState(id: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/private/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public getStandbyMaster(facebookId: string): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/standby/list/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.get(url);
    }

    public async moveUserSlot(slotId: number, newEventId: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/move/' + encodeURIComponent(slotId) + '/' + 
        encodeURIComponent(newEventId) + '/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }
}