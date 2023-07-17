import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SignInPage implements OnInit {

  displayName: string = 'Brady';
  email: string = 'brady91700@gmail.com';
  password: string = '123456789';
  confirmPassword: string = '123456789';

  constructor(private authentificationService: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  async signIn() {
    try {
      await this.authentificationService.createUser(this.displayName, this.email, this.password).then((connected: boolean) => {
        this.router.navigate(['']); //go to home page
      });
    } catch (error) {
      console.error('Error --> ', error);
    }
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

}