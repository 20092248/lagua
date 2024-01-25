import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-bar-status',
  templateUrl: './bar-status.component.html',
  styleUrls: ['./bar-status.component.scss'],
})
export class BarStatusComponent implements OnInit {

  isCapacitor: boolean = false;
  
  constructor(private platform: Platform) { }

  ngOnInit() {
    this.isCapacitor = this.platform.is('capacitor');
  }

}
