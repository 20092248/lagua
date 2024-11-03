import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { Platform, ToastController, isPlatform } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';
import { AlertService } from '../services/alert.service';
import { CONSTANTS } from '../utils/constants';
import { SettingService } from '../services/setting.service';
import { NavigationBar } from '@mauricewegner/capacitor-navigation-bar';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  heightLogo: number = 110;
  heightContent: number | undefined;
  isCapacitor: boolean | undefined;

  constructor(private router: Router, private authentificationService: AuthentificationService, private alertService: AlertService, private platform: Platform,
    private settingService: SettingService) { }

  ngOnInit() {
    Utils.customCapacitorLoginSignInPage(this.settingService);
    this.isCapacitor = this.settingService.isCapacitor;
    this.heightContent = this.platform.height() - this.heightLogo - 80;
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

  passwordForgot() {
    this.alertService.presentAlertWithInput(CONSTANTS.FORGOT_PASSWORD_HEADER, CONSTANTS.FORGOT_PASSWORD_SUBHEADER, CONSTANTS.FORGOT_PASSWORD_MESSAGE, [{ text: 'Recevoir le lien', role: 'validate' }]).then(result => {
      const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (result.role === 'validate') {
        if (result && result.data && result.data.values && result.data.values && regexPattern.test(result.data.values[0])) {
          this.authentificationService.sendPasswordResetEmail(result.data.values[0]).then(confirm => {
            if (confirm) {
              this.alertService.presentToast(CONSTANTS.FORGOT_PASSWORD_LABEL_SUCCESS + result.data.values[0], 5000, 'lagua');
            }
          });
        } else {
          this.alertService.presentToast(CONSTANTS.FORMAT_EMAIL_KO, 3000, 'danger');
        }
      }
    });
  }

}