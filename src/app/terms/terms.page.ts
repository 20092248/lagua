import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

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
