import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall, UserModel, UserRetrieve } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService,
     private route: ActivatedRoute) { }

  ngOnInit() {
    //move our admin call here
    //console.log('App.component starting');

    var userLookup:UserSmall = {
      firstName: this.dataService.userFull.firstName,
      lastName: this.dataService.userFull.lastName,
      facebookId: this.dataService.userFull.facebookId,
      accessToken: this.dataService.facebookToken
    };

    //UserRetrieve
    const userInfo = this.dataService.getUserInfoLogin(userLookup)
        .then(data => {
          this.admin = data.adminFlag ?? false;
          this.volunteer = data.volunteerFlag ?? false;
          this.dataService.userFull.adminFlag = this.admin;
          this.dataService.userFull.realName = data.realNm;
          this.dataService.userFull.cityName = data.cityNm;
          this.dataService.userFull.stateCode = data.stateCd;
          sessionStorage.setItem('accessToken', data.jwt);
        });

   }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}


