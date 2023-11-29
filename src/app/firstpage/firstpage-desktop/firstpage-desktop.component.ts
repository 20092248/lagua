import { Component, OnInit } from '@angular/core';
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
  constructor(private settingService: SettingService, private platform: Platform) { }

  ngOnInit() {
    this.heightWindow = this.platform.height();
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
  }

}
