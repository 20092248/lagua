import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authentificationService: AuthentificationService,
    private router: Router,
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authentificationService.checkUserState()) {
      const uid = this.authentificationService.user.uid ? this.authentificationService.user.uid : '';
      return this.authentificationService.getInfoUser(uid).then(()=>{
        return true;
      });
    } else {
      // RedirectTo log in
      this.router.navigate(['/firstpage']);
      return false;
    }
  }
}
