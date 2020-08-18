import { Component, OnInit } from '@angular/core';
import { ClaimPrincipal, UserSmall, UserModel } from './data';
import { DataService } from './data.service';

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

  public userInfoSmall: UserSmall = {firstName: "", lastName: "", facebookId: "0"};
  public userInfo: UserModel;

  constructor(private dataService: DataService) { }
  

  convertAzureUserAuth(azureInfo: ClaimPrincipal): UserSmall {
    let firstName = azureInfo[0].user_claims[3].val;
 //   console.log('AzureAuth LastName:' + firstName);
    let lastName = azureInfo[0].user_claims[4].val;
 //   console.log('AzureAuth LastName:' + lastName);
    let facebookId = azureInfo[0].user_claims[0].val; //"10158647029715050";
    let userInfoSmall = {firstName: firstName, lastName: lastName, facebookId: facebookId};
    //debug
    userInfoSmall = {firstName: "Kevin", lastName: "Trinkle", facebookId: "10158647029715050"};
    return userInfoSmall;
  }

  ngOnInit() {

    this.dataService.getAzureAuth().subscribe((data: ClaimPrincipal)=>{
   //   console.log(data);
      this.userInfoSmall = this.convertAzureUserAuth(data);
      console.log(this.userInfoSmall);
    },
    () => {this.dataService.userInfo(this.userInfoSmall).subscribe(
      data => (this.userInfo = data),
      () => {
        this.admin = this.userInfo.adminFlag;
        this.appReady = true;
        console.log(this.userInfo);
        this.isLoading = false;
      });
    });
 
  }
}


