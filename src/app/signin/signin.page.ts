import { Component, OnInit } from '@angular/core';
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

  constructor(private authentification: AuthentificationService) { }

  ngOnInit() {
  }

  async createUser() {
    try {
      const user = await this.authentification.createUser(this.displayName, this.email, this.password);
    } catch (error) {
      console.error('Error --> ', error);
    }
  }

}