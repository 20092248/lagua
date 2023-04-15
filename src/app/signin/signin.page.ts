import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SignInPage implements OnInit {

  displayName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authentificationService: AuthentificationService, private router: Router) { }

  ngOnInit() {
  }

  async createUser() {
    try {
      const user = await this.authentificationService.createUser(this.displayName, this.email, this.password);
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