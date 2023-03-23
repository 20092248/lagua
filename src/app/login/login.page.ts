import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginPlugin, FacebookLogin } from '@capacitor-community/facebook-login';
import { Plugins } from '@capacitor/core';
import { isPlatform } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  fbLogin: FacebookLoginPlugin | undefined;
  constructor(private router: Router, private authentificationService: AuthentificationService) { }

  ngOnInit() {
  }

  signInWithGoogle() {
    this.authentificationService.signinwithgoogle().then((connected: boolean) => {
      this.router.navigate(['']); //go to home page
    });
  }

  signInWithFacebook() {
      this.authentificationService.signinwithfacebook().then((connected: boolean) => {
        this.router.navigate(['']); //go to home page
      });
  }

//   FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });
}