import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall, UserModel, UserRetrieve } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
import { ActivatedRoute, ResolveData } from '@angular/router';
import { concatMap } from 'rxjs/operators'
//import { AppConfigService } from './app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Computer Reset Signup';
  isLoading = true;
  appReady = false;
  fullName = "";
  admin: boolean = false;
  volunteer: boolean = false;
  userRtn: any;
  userLookup: UserSmall;

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService) {}

  ngOnInit() {
    //move our admin call here
    console.log('App.component starting');

    /*const promise = this.getLogindata(userLookup).then(data => {
      console.log(promise);
      console.log(Date);
      this.appReady = true;*/
      this.dataService.getUserInfo(this.userLookup).subscribe(attrib => {
        this.admin = attrib.adminFlag ?? false;
        this.dataService.userFull.adminFlag = this.admin;
        this.dataService.userFull.realName = attrib.realNm;
        this.dataService.userFull.cityName = attrib.cityNm;
        this.dataService.userFull.stateCode = attrib.stateCd;
        console.log(attrib);
      })
    // })

   }

  ngOnDestroy() {
    sessionStorage.clear();
  }

  async getLogindata(userLookup: UserSmall): Promise<any> {
    const token = await this.dataService.getLogin(userLookup).toPromise().then(data => {
      sessionStorage.setItem('apiToken', data);
      Object.assign(data);
    });

    return token;
  }
}


