import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-accountmanagement',
  templateUrl: './accountmanagement.page.html',
  styleUrls: ['./accountmanagement.page.scss'],
})
export class AccountmanagementPage implements OnInit {

  isCapacitor: boolean | undefined;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

}
