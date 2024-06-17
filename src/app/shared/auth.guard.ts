import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
import { LoadingService } from '../services/loading.service';
import { Utils } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authentificationService: AuthentificationService,
    private loadingService: LoadingService,
    private router: Router,
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authGuard();
  }

  async authGuard() {
    const uid = await this.authentificationService.isConnected();
    if(uid){
      this.loadingService.present('Chargement...');
        return this.authentificationService.getInfoUser(uid).then(() => {
          Utils.previousUrl = 'home';
          Utils.currentUrl = 'home';
          this.loadingService.dismiss();
          return true;
        }, () => {
          this.loadingService.dismiss(); 
          return false; 
        });
    } else {
      Utils.previousUrl = 'firstpage';
      Utils.currentUrl = 'firstpage';
      this.router.navigate(['/firstpage']);
      return false;
    }
  }
}
