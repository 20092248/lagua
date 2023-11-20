import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';
import { LoadingService } from '../services/loading.service';

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
      const uidConnected = this.authentificationService.checkUserState();
      if (uidConnected) {
        // this.loadingService.present('Chargement...');
        return this.authentificationService.getInfoUser(uidConnected).then(() => {
          // this.loadingService.dismiss();
          return true;
        });
      } else {
        // RedirectTo log in
        this.router.navigate(['/firstpage']);
        return false;
      }
  }
}
