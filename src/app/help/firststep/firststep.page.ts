import { Component, OnInit } from '@angular/core';
import { AdMobService } from 'src/app/services/admob.service';

@Component({
  selector: 'app-firststep',
  templateUrl: './firststep.page.html',
  styleUrls: ['./firststep.page.scss'],
})
export class FirststepPage implements OnInit {

  constructor(private adMobService: AdMobService) { }

  ngOnInit() {
    this.adMobService.showRewardVideo();
  }

}
