import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Platform, ToastController, isPlatform } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private authentificationService: AuthentificationService, private alertService: AlertService, private platform: Platform) { }

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
    if (this.platform.is('capacitor')) {

    } else {
      this.authentificationService.loginwithgoogle().then((connected: boolean) => {
        if (connected) {
          this.router.navigate(['']); //go to home page
        }
      }, error => {
        this.alertService.presentToast(error.message, 2000, 'danger');
      });
    }
  }

  logInWithFacebook() {
    if (this.platform.is('capacitor')) {

    } else {
      this.authentificationService.loginwithfacebook().then((connected: boolean) => {
        if (connected) {
          this.router.navigate(['']); //go to home page
        }
      }, error => {
        this.alertService.presentToast(error.message, 2000, 'danger');
      });
    }
  }

}