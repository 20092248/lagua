import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lessons.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-pronoun',
  templateUrl: './pronoun.page.html',
  styleUrls: ['./pronoun.page.scss'],
})
export class PronounPage implements OnInit {

  pronounLesson: Lesson = {} as Lesson;
  isCapacitor : boolean | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private settingService: SettingService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.pronounLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.pronounLesson) {
      this.authentificationService.updateLesson(this.pronounLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
