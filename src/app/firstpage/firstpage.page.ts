import { Component, OnInit } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.scss'],
})
export class FirstpagePage implements OnInit {

  autoplay: any = {
    delay: 6000,
    pauseOnMouseEnter: true,
  };
  countupBegin: number = 6;

  constructor(private settingsService: SettingService) { }

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
