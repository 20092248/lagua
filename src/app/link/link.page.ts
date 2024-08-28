import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-link',
  templateUrl: './link.page.html',
  styleUrls: ['./link.page.scss'],
})
export class LinkPage implements OnInit {

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
