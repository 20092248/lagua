import { Component, OnInit, Optional } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
register();
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.scss'],
})
export class FirstpagePage implements OnInit {

  isMobile: boolean | undefined;

  constructor(private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) { }

  ngOnInit() {
    console.log('platform : ' + this.platform.platforms() + ', width : ' + this.platform.width() + ', height : ' + this.platform.height());
    this.isMobile = this.platform.is('desktop') || (this.platform.width() > 820 && this.platform.width() > this.platform.height()) ? false : true;
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }



}
