import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.page.html',
  styleUrls: ['./contactus.page.scss'],
})
export class ContactusPage implements OnInit {

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
