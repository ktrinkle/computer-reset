import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { UserSmall, Signup, UserModel, UserEventSignup, UserEventDayOf, UserEventNote, Timeslot, UserManual, openEvent, dumpster } from './data';
import { environment } from './../environments/environment';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public eventIdPass: number;
  public signupIdPass: number;

  public userFull: UserModel = {id: 0, firstName: null, lastName: null, cityName: null,
    stateCode: null, realName: null, facebookId: null, adminFlag: false, volunteerFlag: false};

  public facebookToken: string;

  private REST_API_SERVER = environment.api_url;

  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) { }

  public callToken(): any {
    return sessionStorage.get('accessToken');
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.status === 403|| error.status === 401) {
      this.authenticationService.logout();
      window.location.href = '/.auth/login/facebook';
      return null;
    }
    else {
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
  }

  /** GET - gets Azure Auth info from Facebook for UI to parse */
    public getAzureAuth() {
      var url = '/.auth/me';
      return this.httpClient.get(url);
    }

    public getLogin(userReq: UserSmall): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users';
      return this.httpClient.post(url, userReq, {responseType: 'text'});
    }

    public getFrontPage(userReq: UserSmall): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/frontpage';
      return this.httpClient.post(url, userReq);
    }

    public getUserInfo(userReq: UserSmall): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/attrib/';
      return this.httpClient.post(url, userReq);
    }

    public updateUserNote(userNote: UserEventNote): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signup/note';
      var apirtn = this.httpClient.post(url, userNote, {responseType: 'text'}).toPromise();
      //console.log(apirtn);
      return apirtn;
    }

    // modified to show in DFW local at all times
    public getEvent(){
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/open';
      return this.httpClient.get(url);
    }

    public getEventFuture() {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/upcoming';
      return this.httpClient.get(url);
    }

    public getEventAll() {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/show/all/';
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

    public adminAddToEvent(eventReq: Signup): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/addtoevent';
      return this.httpClient.post(url, eventReq, {responseType: 'text'});
    }

    public updateEvent(eventInfo: Timeslot): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/create';
      return this.httpClient.post(url, eventInfo, {responseType : 'text'});
    }

    public getSignedUpUsers(eventId: number): Promise<UserEventSignup[]> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/' + encodeURIComponent(eventId) + '';
      return this.httpClient.get<UserEventSignup[]>(url).toPromise();
    }

    public getSignupDayOf(eventId: number): Promise<UserEventDayOf[]> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/dayof/' + encodeURIComponent(eventId) + '';
      return this.httpClient.get<UserEventDayOf[]>(url).toPromise();
    }

    public async sendUserSlot(id: number, attendNbr: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/signedup/' + encodeURIComponent(id) + '/'
      + encodeURIComponent(attendNbr) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async sendUserConfirm(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/confirm/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async sendUserAttend(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/attended/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async sendNoShow(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/noshow/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changeEventState(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/close/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changePrivateState(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/private/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changeVolunteerState(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/update/volunteer/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changeBanState(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/update/ban/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async changeAdminState(id: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/update/admin/' + encodeURIComponent(id) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public getStandbyMaster(): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/standby/list';
      return this.httpClient.get(url);
    }

    public async moveUserSlot(slotId: number, newEventId: number): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/move/' + encodeURIComponent(slotId) + '/' +
        encodeURIComponent(newEventId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public lookupUser(nameVal: string): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/lookup/' + encodeURIComponent(nameVal) + '';
      return this.httpClient.get(url);
    }

    public getOpenEventUser(): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/events/list';
      return this.httpClient.get<openEvent>(url);
    }

    public async userMoveSlot(slotId: number, newEventId: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/signup/move/' + encodeURIComponent(slotId) + '/' +
        encodeURIComponent(newEventId) + '/' + encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public async userDeleteSignup(slotId: number, facebookId: string): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/signup/delete/' + encodeURIComponent(slotId) + '/' +
         encodeURIComponent(facebookId) + '';
      return this.httpClient.put(url, null, {responseType: 'text'}).toPromise();
    }

    public updateUser(userInfo: UserManual): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/users/manual';
      return this.httpClient.post(url, userInfo);
    }

    public getSpiel(): Promise<string> {
      var url = this.REST_API_SERVER + '/api/computerreset/api/helper/spiel';
      return this.httpClient.get(url, {responseType: 'text'}).toPromise();
    }

    public getDumpster(): any {
      var url = this.REST_API_SERVER + '/api/computerreset/api/ref/dumpster';
      return this.httpClient.get(url);
    }

}
