import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LessonService } from '../services/lesson.service';
import { Lesson } from '../model/lesson.model';

@Component({
  selector: 'app-legal-notices',
  templateUrl: './legal-notices.page.html',
  styleUrls: ['./legal-notices.page.scss'],
})
export class LegalNoticesPage implements OnInit {

  homeSetting: any = {};
  content: SafeHtml = '';

  constructor(private router: Router, private lessonService: LessonService, private settingService: SettingService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
    this.lessonService.getLessonByCode('LENO').then(((result: Lesson) => {
      this.content = this.sanitizer.bypassSecurityTrustHtml(result.content);
    }));
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
