import { Component, OnInit } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {

  homeSetting: any = {};

  constructor(private router: Router, private settingService: SettingService) { }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
