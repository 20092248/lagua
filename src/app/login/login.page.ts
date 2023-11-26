import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Platform, ToastController, isPlatform } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';
import { AlertService } from '../services/alert.service';
import { CONSTANTS } from '../utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private authentificationService: AuthentificationService, private alertService: AlertService) { }

  ngOnInit() {
  }

  login() {
    this.authentificationService.login(this.email, this.password).then((connected: boolean) => {
      if (connected) {
        this.router.navigate(['']); //go to home page
      }
    });
  }

  logInWithGoogle() {
    this.authentificationService.loginWithGoogle().then((connected: boolean) => {
      if (connected) {
        this.router.navigate(['']); //go to home page
      } else {
        this.alertService.presentToast(CONSTANTS.LOGIN_KO, 2000, 'danger');
      }
    }, e => { console.error(e); });
  }

  logInWithFacebook() {
    this.authentificationService.loginWithFacebook().then((connected: boolean) => {
      if (connected) {
        this.router.navigate(['']); //go to home page
      } else {
        this.alertService.presentToast(CONSTANTS.LOGIN_KO, 2000, 'danger');
      }
    }, e => { console.error(e); });
  }

}