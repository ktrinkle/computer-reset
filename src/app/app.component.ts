import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClaimPrincipal, UserSmall, UserModel } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
import { AppConfigService } from './app-config.service';
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
  admin = sessionStorage.getItem('admin'); //I think we need to subscribe?

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService) { }
  

  convertAzureUserAuth(azureInfo: ClaimPrincipal) {
    let firstName = azureInfo[0].user_claims[3].val;
    sessionStorage.setItem('firstName', firstName);
 //   console.log('AzureAuth LastName:' + firstName);
    let lastName = azureInfo[0].user_claims[4].val;
    sessionStorage.setItem('lastName', lastName);
 //   console.log('AzureAuth LastName:' + lastName);
    let facebookId = azureInfo[0].user_claims[0].val;
    sessionStorage.setItem('facebookId', facebookId);
    let accessToken = azureInfo[0].access_token;
    sessionStorage.setItem('azureToken', accessToken);
  }


  ngOnInit() {

    this.dataService.getAzureAuth().subscribe((data: ClaimPrincipal)=>{
   //   console.log(data);
      this.convertAzureUserAuth(data);
      this.dataService.getAdmin(sessionStorage.getItem('facebookId'));
      //console.log(this.dataService.userSmall);
    });

    
    //we don't have the admin piece yet...can move that to /home
  }

  ngOnDestroy() {
    sessionStorage.clear();
  }
}


