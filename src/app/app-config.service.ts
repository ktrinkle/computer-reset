import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';
import { DataService } from './data.service';

@Injectable()
export class AppConfigService {

  public version: string;
  public apiEndpointSomeData: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private dataService: DataService) {}

  load() :Promise<any>  {

    //console.log('Initializing app');
    const promise = this.authenticationService.loginApi('byronpcjr','IdSFaWr7*@[')
      .toPromise()
      .then(data => {
        Object.assign(this, data);
        return data;
      });

    return promise;
  }

  loadFb() :Promise<any>  {

    //console.log('Initializing FB');
    const promise = this.dataService.getAzureAuth()
      .toPromise()
      .then(data => {
        let firstName = data[0].user_claims[3].val;
        sessionStorage.setItem('firstName', firstName);
     //   console.log('AzureAuth LastName:' + firstName);
        let lastName = data[0].user_claims[4].val;
        sessionStorage.setItem('lastName', lastName);
     //   console.log('AzureAuth LastName:' + lastName);
        let facebookId = data[0].user_claims[0].val;
        sessionStorage.setItem('facebookId', facebookId);
        Object.assign(this, data);
        return data;
      });

    return promise;
  }
}