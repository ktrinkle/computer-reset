import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor (private dataService: DataService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      const token = sessionStorage.getItem('apiToken');

      return this.dataService.userFull.adminFlag;
  }
  
}
