import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';
import { DataService } from './data.service';
import { environment } from 'src/environments/environment';


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

    //console.log('Initializing FB');
    if (environment.production) {
      var promise = this.dataService.getAzureAuth()
        .toPromise()
        .then(data => {data[0].user_claims.map( uc => {
            if(uc.typ.includes('givenname')) {
              this.dataService.userFull.firstName = uc.val;
              //console.log('fn' + uc.val);
            }
            if(uc.typ.includes('surname')) {
              this.dataService.userFull.lastName = uc.val;
              //console.log('Ln' + uc.val);
            }
            if(uc.typ.includes('nameidentifier')) {
              this.dataService.userFull.facebookId = uc.val;
              //console.log('fbId' + uc.val);
            }
          }
          )
       });
      } else {
        this.dataService.userFull.firstName = 'Dev';
        this.dataService.userFull.lastName = 'Mode';
        this.dataService.userFull.facebookId = '10158647029715050';
      }

    return promise;
  }
}