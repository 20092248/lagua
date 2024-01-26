import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-firststep',
  templateUrl: './firststep.page.html',
  styleUrls: ['./firststep.page.scss'],
})
export class FirststepPage implements OnInit {

  isCapacitor: boolean | undefined;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

}
