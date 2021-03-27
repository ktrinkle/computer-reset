import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';

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

   }

  ngOnDestroy() {
    sessionStorage.clear();
  }

}


