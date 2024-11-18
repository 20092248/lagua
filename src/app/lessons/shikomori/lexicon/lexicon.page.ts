import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/model/lesson.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-lexicon',
  templateUrl: './lexicon.page.html',
  styleUrls: ['./lexicon.page.scss'],
})
export class LexiconPage implements OnInit {

  lexiconLesson: Lesson = {} as Lesson;
  isOverlay: boolean | undefined;
  content: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, 
    private settingService: SettingService, private lessonService: LessonService) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.lexiconLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() { 
    this.isOverlay = this.settingService.isOverlay;
    if(this.lessonService.lesson && this.lessonService.lesson.code !== 'LEXI') {
      this.lessonService.getLessonByCode('LEXI').then(lesson=> {
        this.content = lesson.content.shikomori; //Utils.convertStringToHtml(lesson.content.shikomori);
      });
    }
  }

  saveLesson() {
    if (this.authentificationService.user.uid && this.lexiconLesson) {
      this.authentificationService.updateLesson(this.lexiconLesson, 'users', this.authentificationService.user.uid).then(() => {
        this.router.navigate(['/tabs/lessons']);
      });
    } else {
      console.error('Erreur lors de la sauvegarde de la leçon');
    }
  }

}
