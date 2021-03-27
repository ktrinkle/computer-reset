import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class LoadGuard implements CanActivate {
  constructor (private dataService: DataService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      if (this.dataService.userFull.id) {
        return true;
      } else {
        return false;
      }
  }

}
