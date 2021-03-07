import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface homeData {
  admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeResolve implements Resolve<homeData>{

  constructor(private dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<homeData> {

    var userLookup = {
      firstName: this.dataService.userFull.firstName,
      lastName: this.dataService.userFull.lastName,
      facebookId: this.dataService.userFull.facebookId,
      accessToken: this.dataService.facebookToken
    };

    return this.dataService.getLogin(userLookup).subscribe(
      token => sessionStorage.setItem('apiToken', token)
    );

  }
}
