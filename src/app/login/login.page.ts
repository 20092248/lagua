import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { ToastController, isPlatform } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private authentificationService: AuthentificationService, private toastController: ToastController) { }

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
    this.authentificationService.loginwithgoogle().then((connected: boolean) => {
      if (connected) {
        this.router.navigate(['']); //go to home page
      }
    }, error => {
      console.error(error);
      this.presentToast(error.message);
    });
  }

  logInWithFacebook() {
    this.authentificationService.loginwithfacebook().then((connected: boolean) => {
      if (connected) {
        this.router.navigate(['']); //go to home page
      }
    }, error => {
      console.error(error);
      this.presentToast(error.message);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

}