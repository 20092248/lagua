import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { NavigationBar } from '@mauricewegner/capacitor-navigation-bar';
import { AlertService } from 'src/app/services/alert.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-firstpage-mobile',
  templateUrl: './firstpage-mobile.component.html',
  styleUrls: ['./firstpage-mobile.component.scss'],
})
export class FirstpageMobileComponent implements OnInit {

  autoplay: any = {
    delay: 6000,
    pauseOnMouseEnter: true,
  };
  countupBegin: number = 6;
  @Input() isMobile: boolean | undefined;
  @Input() navigationBarEvent: EventEmitter<any> | undefined;

  constructor(private location: Location, private alertService: AlertService, private settingService: SettingService, private platform: Platform, private router: Router, private routerOutlet: IonRouterOutlet) { }
  
  ngOnInit() {
    this.autoplayTimeLeft();
    this.settingService.getUserInformation();
    Utils.customCapacitorApp(this.settingService);
    this.navigationBarEvent?.subscribe(() => {
      if(this.settingService.isCapacitor){
        StatusBar.setBackgroundColor({ color: '#46895c' });
      }
      NavigationBar.setColor({color: '#74a884', darkButtons: false});
    });
  }

  autoplayTimeLeft() {
    const progressCircle = document.querySelector(".autoplay-progress svg") as HTMLElement;

    const swiperEl = document.querySelector("swiper-container");
    swiperEl?.addEventListener("autoplaytimeleft", (e: any) => {
      const [swiper, time, progress] = e.detail;
      const p = 1 - progress as unknown
      progressCircle?.style.setProperty("--progress", p as string);
    });
  }

  goTo(route: string) {
    if(this.isMobile) {
      this.router.navigate([route]);
    }
  }

}
