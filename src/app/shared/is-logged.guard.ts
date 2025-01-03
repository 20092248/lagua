import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {
  constructor(
    private authentificationService: AuthentificationService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isLoggedGuard();
  }

  async isLoggedGuard() {
    const uid = await this.authentificationService.isConnected();
    if(uid){
      Utils.previousUrl = 'home';
      Utils.currentUrl = 'home';
      this.router.navigate(['']);
      return false;
    } else {
      Utils.previousUrl = 'firstpage';
      Utils.currentUrl = 'firstpage';
      return true;
    }
  }

}
