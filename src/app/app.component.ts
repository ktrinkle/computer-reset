import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall, UserModel } from './data';
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

    /*var userLookup:UserSmall = {
      firstName: this.dataService.userFull.firstName,
      lastName: this.dataService.userFull.lastName,
      facebookId: this.dataService.userFull.facebookId,
      accessToken: this.dataService.facebookToken
    };

    this.dataService.getUserInfo(userLookup).subscribe(data => {
      this.admin = data.adminFlag ?? false;
      this.volunteer = data.volunteerFlag ?? false;
      this.dataService.userFull.adminFlag = this.admin;
      this.dataService.userFull.realName = data.realNm;
      this.dataService.userFull.cityName = data.cityNm;
      this.dataService.userFull.stateCode = data.stateCd;
      sessionStorage.setItem('accessToken', data.jwt);
      //console.log(this.admin);
    });*/

    this.userRtn = this.route.snapshot.data['data'];
    sessionStorage.setItem('accessToken', this.userRtn.jwt);
    this.admin = this.userRtn.adminFlag ?? false;
    this.volunteer = this.userRtn.volunteerFlag ?? false;
    this.dataService.userFull.adminFlag = this.admin;
    this.dataService.userFull.realName = this.userRtn.realNm;
    this.dataService.userFull.cityName = this.userRtn.cityNm;
    this.dataService.userFull.stateCode = this.userRtn.stateCd;

    /*
    this.dataService.getCity(event.value).pipe(
      takeUntil(this.destroy$)).subscribe(result => {
        this.cities = result;
    */

   }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}


