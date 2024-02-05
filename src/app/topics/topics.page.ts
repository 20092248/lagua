import { Component, OnInit } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage implements OnInit {

  sections: any[] = [];

  constructor(private router: Router, private settingService: SettingService) { }

  get isOverlay(){
    return this.settingService.isOverlay;
  }  

  ngOnInit() {
    this.sections = this.settingService.topics?.sections;
    if (!this.sections) {
      this.settingService.getSettings().then(setting => {
        this.sections = setting?.topics?.sections;
      })
    }
  }

  goToDetailSection(section: any) {
    this.router.navigate(['/tabs/topics/' + section.code]);
  }

}
