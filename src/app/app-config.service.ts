import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable()
export class AppConfigService {

  public version: string;
  public apiEndpointSomeData: string;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {}

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
}