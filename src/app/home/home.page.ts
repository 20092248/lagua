import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User | undefined; 
  constructor(private authentificationService : AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
  }

}
