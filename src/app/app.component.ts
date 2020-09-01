import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall, UserRetrieve } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
//import { AppConfigService } from './app-config.service';
import { takeUntil } from 'rxjs/operators';

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

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService) { }
  
  ngOnInit() {
    //move our admin call here
    //console.log('App.component starting');
    //admin returns webpage if null?

    var userLookup:UserSmall = {
      firstName: sessionStorage.getItem('firstName'), 
      lastName: sessionStorage.getItem('lastName'),
      facebookId: sessionStorage.getItem('facebookId') 
    };

    this.dataService.getUserInfo(userLookup).subscribe(data => {
      this.admin = data.adminFlag ?? false;
      sessionStorage.setItem('admin', this.admin.toString());
      sessionStorage.setItem('realName', data.realNm);
      sessionStorage.setItem('cityNm', data.cityNm);
      sessionStorage.setItem('stateCd', data.stateCd);
      this.dataService.userFull.adminFlag = this.admin;
      this.dataService.userFull.realName = data.realNm;
      this.dataService.userFull.cityName = data.cityNm;
      this.dataService.userFull.stateCode = data.stateCd;
      console.log(this.admin);
    });

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


