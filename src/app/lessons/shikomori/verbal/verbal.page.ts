import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lesson.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';
import { CONSTANTS } from 'src/app/utils/constants';

@Component({
  selector: 'app-verbal',
  templateUrl: './verbal.page.html',
  styleUrls: ['./verbal.page.scss'],
})
export class VerbalPage implements OnInit {

  verbalLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService
    , private settingService: SettingService, private alertService: AlertService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.verbalLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  get user() {
    return this.authentificationService.user;
  }
  get dialect() {
    return this.authentificationService.dialect;
  }
  get userDialect() {
    return this.user.dialects[this.dialect];
  }

  ngOnInit() { 
    this.isOverlay = this.settingService.isOverlay;
  }

  saveLesson() {
    if (this.verbalLesson.order < this.userDialect.lesson.order) {
      this.router.navigate(['/tabs/lessons']);
    } else if (this.user.uid && this.verbalLesson) {
      this.authentificationService.updateLesson(this.verbalLesson, this.user.uid).then(() => {
        this.alertService.presentToast(CONSTANTS.UPDATE_LESSON_SUCCESS, 3000, 'lagua');
        this.router.navigate(['/tabs/lessons']);
      }, () => { console.error('Erreur lors de la sauvegarde de la leçon'); });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
