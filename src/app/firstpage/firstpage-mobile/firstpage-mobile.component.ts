import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NavigationBar } from '@mauricewegner/capacitor-navigation-bar';
import { SettingService } from 'src/app/services/setting.service';

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

  constructor(private settingsService: SettingService, private platform: Platform, private router: Router) { }
  
  ngOnInit() {
    this.autoplayTimeLeft();
    this.settingsService.getUserInformation();
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
    NavigationBar.setColor({color: '#74a884', darkButtons: false});
    this.navigationBarEvent?.subscribe(() => {
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
    this.router.navigate([route]);
  }

}
