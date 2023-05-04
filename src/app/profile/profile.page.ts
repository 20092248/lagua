import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User | undefined;
  currentDate: Date = new Date();

  constructor(private router: Router, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
  }

  getActualLevelByCode() {
    const code = this.user?.level?.code;
    if (code === '0') {
      return 'Découverte';
    } else if (code === '1') {
      return 'Débutant';
    } else if (code === '2') {
      return 'Intermédiaire';
    } else if (code === '3') {
      return 'Intermédiaire avancé';
    } else if (code === '4') {
      return 'Avancé';
    } else {
      return '';
    }
  }

  logout() {
    this.authentificationService.logout().then(() => {
      this.router.navigate(['/firstpage']);
    });
  }

}
