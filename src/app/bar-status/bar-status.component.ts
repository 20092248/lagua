import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-bar-status',
  templateUrl: './bar-status.component.html',
  styleUrls: ['./bar-status.component.scss'],
})
export class BarStatusComponent implements OnInit {

  @Input() isOverlay: boolean | undefined;
  
  constructor() { }

  ngOnInit() { }

}
