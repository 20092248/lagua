import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lesson.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-accent',
  templateUrl: './accent.page.html',
  styleUrls: ['./accent.page.scss'],
})
export class AccentPage implements OnInit {

  accentLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;
  contents: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private lessonService: LessonService, private settingService: SettingService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.accentLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.lessonService.getLessonByCode('ACCE').then(((result: Lesson) => {
      this.contents = result.content['km'];
    }));
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.accentLesson) {
      this.authentificationService.updateLesson(this.accentLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
