import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lesson.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-nominal',
  templateUrl: './nominal.page.html',
  styleUrls: ['./nominal.page.scss'],
})
export class NominalPage implements OnInit {

  nominalLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;
  contents: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService
    , private settingService: SettingService, private lessonService: LessonService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.nominalLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.lessonService.getLessonByCode('CLNO').then(((result: Lesson) => {
      this.contents = result.content['km'];
    }));
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.nominalLesson) {
      this.authentificationService.updateLesson(this.nominalLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
