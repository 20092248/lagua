import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IonRouterOutlet, IonTabs, Platform, PopoverController } from '@ionic/angular';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { AdMobService } from '../services/admob.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  tabSelected: string = '';

  get premium(){
    return this.authentification.getPremium();
  }

  constructor(private router: Router, private platform: Platform, private popoverController: PopoverController, private authentification: AuthentificationService, private adMobService: AdMobService) {
    if(this.platform.is('capacitor')) {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
        this.tabSelected = event.url.substring(event.url.lastIndexOf("/") + 1);
      });
    }
  }

  ngOnInit(): void {
    this.adMobService.showBanner();
   }

  logout() {
    this.authentification.logout(true).then(() => {
      this.goTo('/firstPage');
    });
  }

  setCurrentTab(event: any) {
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
