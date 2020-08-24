import { Component, OnInit } from '@angular/core';
import { ClaimPrincipal, UserSmall, UserModel } from './data';
import { DataService } from './data.service';
import { AuthenticationService } from './authentication/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'Computer Reset Signup';
  isLoading = true;
  appReady = false;
  admin = false;

  constructor(public authenticationService: AuthenticationService,
     public dataService: DataService) { }
  

  convertAzureUserAuth(azureInfo: ClaimPrincipal): UserSmall {
    let firstName = azureInfo[0].user_claims[3].val;
    localStorage.setItem('firstName', firstName);
 //   console.log('AzureAuth LastName:' + firstName);
    let lastName = azureInfo[0].user_claims[4].val;
    localStorage.setItem('lastName', lastName);
 //   console.log('AzureAuth LastName:' + lastName);
    let facebookId = azureInfo[0].user_claims[0].val;
    localStorage.setItem('facebookId', facebookId);
    let accessToken = azureInfo[0].access_token;
    localStorage.setItem('azureToken', accessToken);
    let userInfoSmall = {firstName: firstName, lastName: lastName, 
      facebookId: facebookId, accessToken: accessToken};
    //debug
    //userInfoSmall = {firstName: "Kevin", lastName: "Trinkle", facebookId: "10158647029715050"};
    return userInfoSmall;
  }


  ngOnInit() {

    this.dataService.getAzureAuth().subscribe((data: ClaimPrincipal)=>{
   //   console.log(data);
      this.dataService.userSmall = this.convertAzureUserAuth(data);
      console.log(this.dataService.userSmall);
    });

    this.authenticationService.loginApi('byronpcjr','IdSFaWr7*@[')
      .pipe(first())
      .subscribe();

    //temporary

    //we don't have the admin piece yet...can move that to /home
  }
}


