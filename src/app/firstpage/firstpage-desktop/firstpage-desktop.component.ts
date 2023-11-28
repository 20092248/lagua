import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-firstpage-desktop',
  templateUrl: './firstpage-desktop.component.html',
  styleUrls: ['./firstpage-desktop.component.scss'],
})
export class FirstpageDesktopComponent implements OnInit {

  isMobile: boolean = false;
  homeSetting: any = {};
  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
  }

}
