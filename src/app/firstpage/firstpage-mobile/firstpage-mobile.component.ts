import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
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

  constructor(private settingsService: SettingService, private platform: Platform) { }

  ngOnInit() {
    this.autoplayTimeLeft();
    this.settingsService.getUserInformation().then();
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

}
