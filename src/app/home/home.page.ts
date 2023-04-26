import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User | undefined;

  constructor(private router: Router, private themeService: ThemeService, private authentificationService: AuthentificationService, private popoverController: PopoverController) {
   }
  get getTheme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    this.user = this.authentificationService.user;
  }

  logout() {
    this.authentificationService.logout().then(() => {
      this.goTo('/firstpage');
    });
  }

  goTo(routing: string) {
    this.router.navigate([routing]);
    this.dismissPopover();
  }

  changeMode(){
    this.themeService.setAppTheme(this.getTheme);
  }

  dismissPopover() {
    if (this.authentificationService) {
      this.popoverController.dismiss();
    }
  }

}
