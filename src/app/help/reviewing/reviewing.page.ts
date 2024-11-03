import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-reviewing',
  templateUrl: './reviewing.page.html',
  styleUrls: ['./reviewing.page.scss'],
})
export class ReviewingPage implements OnInit {

  isOverlay: boolean | undefined;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
  }

}
