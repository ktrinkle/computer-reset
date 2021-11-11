import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSmall } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
import { Store } from '@ngrx/store';
import { currentEvents } from './store/cr.actions';


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
  userRtn: any;
  userLookup: UserSmall;

  constructor(public authenticationService: AuthenticationService,
      private store: Store,
      public dataService: DataService) {
     }

  ngOnInit() {
      this.userLookup = {
          firstName: this.dataService.userFull.firstName,
          lastName: this.dataService.userFull.lastName,
          facebookId: this.dataService.userFull.facebookId,
          accessToken: this.dataService.facebookToken
        };

      this.store.dispatch(currentEvents({ userLoad: this.userLookup }));
   }

  ngOnDestroy() {
    sessionStorage.clear();
  }

}


