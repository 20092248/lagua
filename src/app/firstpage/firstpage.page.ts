import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Platform } from '@ionic/angular';
register();
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.scss'],
})
export class FirstpagePage implements OnInit {

  isMobile: boolean | undefined;

  constructor(private platform: Platform) { }

  ngOnInit() {
    this.isMobile = this.platform.is('desktop') || (this.platform.width() > 820 && this.platform.width() > this.platform.height()) ? false : true;
  }

}
