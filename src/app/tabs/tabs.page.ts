import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  user: User | undefined;

  constructor(private router: Router, private popoverController: PopoverController, private authentification: AuthentificationService) { }

  ngOnInit(): void {
    this.user = this.authentification.user;
  }

  logout() {
    this.authentification.logout().then(() => {
      this.goTo('/firstPage');
    });
  }

  goTo(routing: string) {
    this.router.navigate([routing]);
    this.dismissPopover();
  }

  dismissPopover() {
    if (this.popoverController) {
      this.popoverController.dismiss();
    }
  }

}
