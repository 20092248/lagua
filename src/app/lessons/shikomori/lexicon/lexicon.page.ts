import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  contents: any[] = [];
  
  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService
    , private settingService: SettingService, private lessonService: LessonService, private sanitizer: DomSanitizer) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.lexiconLesson = this.router.getCurrentNavigation()?.extras?.state?.['data'] as Lesson;
      }
    });
  }

  ngOnInit() { 
    this.isOverlay = this.settingService.isOverlay;
    this.lessonService.getLessonByCode('LEXI').then(((result: Lesson) => {
      this.contents = result.content['km'];
    }));
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
