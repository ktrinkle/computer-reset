import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AppConfigService {

  public version: string;
  public apiEndpointSomeData: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private dataService: DataService) {}

  load() :Promise<any>  {

    console.log('Initializing app');
    const promise = this.authenticationService.loginApi('byronpcjr','IdSFaWr7*@[')
      .toPromise()
      .then(data => {
        Object.assign(this, data);
        return data;
      });

    return promise;
  }

  loadFb() :Promise<any>  {

    console.log('Initializing FB');
    const promise = this.dataService.getAzureAuth()
      .toPromise()
      .then(data => {data[0].user_claims.map( uc => {
          if(uc.typ.includes('givenname')) {
            sessionStorage.setItem('firstName', uc.val);
            console.log('fn' + uc.val);
          }
          if(uc.typ.includes('surname')) {
            sessionStorage.setItem('lastName', uc.val);
            console.log('Ln' + uc.val);
          }
          if(uc.typ.includes('nameidentifier')) {
            sessionStorage.setItem('facebookId', uc.val);
            console.log('fbId' + uc.val);
          }
        }
        )

  /*      let firstName = data[0].user_claims[3].val;
        sessionStorage.setItem('firstName', firstName);
        console.log('AzureAuth LastName:' + firstName);
        let lastName = data[0].user_claims[4].val;
        sessionStorage.setItem('lastName', lastName);
        console.log('AzureAuth LastName:' + lastName);
        let facebookId = data[0].user_claims[0].val;
        sessionStorage.setItem('facebookId', facebookId);
        Object.assign(this, data);
        return data;*/
      });

/*
[{"access_token":"EAArvGaqWZBegBAPNNmV4qZADpcqjUGAEO0nRKsRFuKhmqjyaW0hHTZBFLnDtTZBdNcFgtEZCfyqvmj28fAOAF1yWPthW1kuRD8jBD7kKQe1e3VSYRAd8Fn2QhuaQdlFSTqCT8KwYeg5SNmdO7cnO9q9LcJmIYiDnZAPfrr2ttkZCQO8RMPZBy5tp",
"expires_on":"2020-10-26T02:22:15.3666807Z",
"provider_name":"facebook",
"user_claims":[{
  "typ":"http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/nameidentifier","val":"10158647029715050"},
  {"typ":"http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/emailaddress","val":"trinkle@psa-history.org"},
  {"typ":"http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/name","val":"Kevin Trinkle"},
  {"typ":"http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/givenname","val":"Kevin"},
  {"typ":"http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/surname","val":"Trinkle"}],"user_id":"trinkle@psa-history.org"}]
*/

    return promise;
  }
}