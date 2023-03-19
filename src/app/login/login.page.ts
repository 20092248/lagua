import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

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
}