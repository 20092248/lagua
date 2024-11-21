import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../services/setting.service';
import { LessonService } from '../services/lesson.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Lesson } from '../model/lesson.model';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {

  homeSetting: any = {};
  content: SafeHtml = '';

  constructor(private router: Router, private lessonService: LessonService, private settingService: SettingService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.settingService.getSettings().then(setting => {
      this.homeSetting = setting.home;
    });
    this.lessonService.getLessonByCode('CGV').then(((result: Lesson) => {
      this.content = this.sanitizer.bypassSecurityTrustHtml(result.content);
    }));
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

}
