import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../model/user.model';
import { SettingService } from '../services/setting.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-parameter',
  templateUrl: './parameter.page.html',
  styleUrls: ['./parameter.page.scss'],
})
export class ParameterPage implements OnInit {

  user: User = {} as User;
  categorie: any;

  constructor(private router: Router, private authentificationService: AuthentificationService,
    private settingsService: SettingService, private themeService: ThemeService) { }

  get theme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    this.theme
    this.user = this.authentificationService.user;
    console.log(this.user);
    this.settingsService.getSetting('reviews').then((data => {
      this.categorie = data.categories.find((c: any) => c.code === this.user.review.category);
    }));
  }

  changeMode() {
    this.themeService.setAppTheme(this.theme);
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.router.navigate(['/firstpage']);
    });
  }

}
