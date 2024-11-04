import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { filter } from 'rxjs';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  tabSelected: string = '';

  get premium() {
    return this.authentification.getPremium();
  }

  constructor(private router: Router, private settingService: SettingService, private authentification: AuthentificationService) {
    if (this.settingService.isCapacitor) {
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
        this.tabSelected = event.url.substring(event.url.lastIndexOf("/") + 1);
      });
    }
  }

  ngOnInit(): void { }

  setCurrentTab(event: any) {
    this.tabSelected = event.tab;
  }

}
