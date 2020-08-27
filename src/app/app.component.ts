import { Component, OnInit, OnDestroy } from '@angular/core';
//import { ClaimPrincipal, UserSmall, UserModel } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
//import { AppConfigService } from './app-config.service';
import { first } from 'rxjs/operators';

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
  admin = "false";

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService) { }
  
  ngOnInit() {
    //move our admin call here
    console.log('App.component starting');

    this.admin = this.dataService.getAdmin(sessionStorage.getItem('facebookId')).toPromise().toString();
    sessionStorage.setItem('admin', this.admin);
    console.log('Admin: ' + this.admin);
    
    //we don't have the admin piece yet...can move that to /home
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}


