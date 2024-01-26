import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-bar-status',
  templateUrl: './bar-status.component.html',
  styleUrls: ['./bar-status.component.scss'],
})
export class BarStatusComponent implements OnInit {

  isCapacitor: boolean = false;
  
  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

}
