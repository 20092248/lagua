import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lessons.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-verbal',
  templateUrl: './verbal.page.html',
  styleUrls: ['./verbal.page.scss'],
})
export class VerbalPage implements OnInit {

  verbalLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.verbalLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.verbalLesson) {
      this.authentificationService.updateLesson(this.verbalLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}