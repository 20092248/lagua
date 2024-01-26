import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.page.html',
  styleUrls: ['./learning.page.scss'],
})
export class LearningPage implements OnInit {

  isCapacitor: boolean | undefined;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

}
