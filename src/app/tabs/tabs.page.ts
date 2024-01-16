import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs, PopoverController } from '@ionic/angular';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  tabSelected: string = '';
  @ViewChild('tabs', { static: false }) tabs: IonTabs = {} as IonTabs;

  constructor(private router: Router, private popoverController: PopoverController, private authentification: AuthentificationService) { }

  ngOnInit(): void {}

  logout() {
    this.authentification.logout(true).then(() => {
      this.goTo('/firstPage');
    });
  }

  setCurrentTab(event : any) {
    this.tabSelected = event.tab;
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
