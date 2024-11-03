import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-firstpage-desktop',
  templateUrl: './firstpage-desktop.component.html',
  styleUrls: ['./firstpage-desktop.component.scss'],
})
export class FirstpageDesktopComponent implements OnInit {

  isMobile: boolean = false;
  heightWindow: number = 0;
  homeSetting: any = {};
  platforms: any = {};
  constructor(private router: Router, private settingService: SettingService, private platform: Platform) { }

  ngOnInit() {
    this.heightWindow = this.platform.height();
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
    this.platforms = this.platform.platforms();
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
