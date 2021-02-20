import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserModel, UserSmall } from './data';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'any'
})
export class UserResolver implements Resolve<string> {

  constructor(public dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot): string {
    var userLookup:UserSmall = {
      firstName: this.dataService.userFull.firstName,
      lastName: this.dataService.userFull.lastName,
      facebookId: this.dataService.userFull.facebookId,
      accessToken: this.dataService.facebookToken
    };
    console.log(userLookup);

    const promise = this.dataService.getLogin(userLookup).then(data => {
      sessionStorage.setItem('apiToken', data);
      Object.assign(data)
      });

    return promise.toString();
  }

}
