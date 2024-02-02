import { Component, EventEmitter, OnInit, Optional } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { NavigationBar } from '@mauricewegner/capacitor-navigation-bar';
register();
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.scss'],
})
export class FirstpagePage implements OnInit {

  isMobile: boolean | undefined;
  navBarCapacitor: boolean = false;
  navigationBarEvent: EventEmitter<any> = new EventEmitter();

  constructor(private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) { }

  ngOnInit() {
    console.log('platform : ' + this.platform.platforms() + ', width : ' + this.platform.width() + ', height : ' + this.platform.height());
    this.isMobile = this.isPlatformMobile();
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ionViewWillEnter() {
    if (this.navBarCapacitor) {
      this.navigationBarEvent.emit(true);
    }
    this.navBarCapacitor = true;
  }

  isPlatformMobile() {
    if (this.platform.is('capacitor')) {
      return true;
    } else if (this.platform.width() > 820 && this.platform.width() > this.platform.height()) {
      return false;
    } else {
      return true;
    }
  }

}
