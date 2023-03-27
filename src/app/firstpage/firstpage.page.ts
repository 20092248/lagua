import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.scss'],
})
export class FirstpagePage implements OnInit {

  slideOpts: any = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 6000,
      pauseOnMouseEnter: true
    },
    speed: 2000,
    direction: 'vertical'
  };
  constructor() { }

  ngOnInit() {
  }

}