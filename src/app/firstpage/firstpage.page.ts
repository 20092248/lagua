import { Component, EventEmitter, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { Utils } from '../utils/utils';
import { SettingService } from '../services/setting.service';
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

  constructor(private alertService: AlertService, private platform: Platform, private routerOutlet: IonRouterOutlet, private settingService: SettingService) { }

  ngOnInit() {
    console.log('platform : ' + this.platform.platforms() + ', width : ' + this.platform.width() + ', height : ' + this.platform.height());
    Utils.customCapacitorApp(this.settingService);
    this.isMobile = this.isPlatformMobile();
  }

  ionViewWillEnter() {
    if (this.navBarCapacitor) {
      this.navigationBarEvent.emit(true);
    }
    this.navBarCapacitor = true;
  }

  isPlatformMobile() {
    if (this.settingService.isCapacitor) {
      return true;
    } else if (this.platform.width() > 820 && this.platform.width() > this.platform.height()) {
      return false;
    } else {
      return true;
    }
  }

}
