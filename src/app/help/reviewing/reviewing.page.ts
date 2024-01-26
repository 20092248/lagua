import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-reviewing',
  templateUrl: './reviewing.page.html',
  styleUrls: ['./reviewing.page.scss'],
})
export class ReviewingPage implements OnInit {

  isCapacitor: boolean | undefined;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

}
