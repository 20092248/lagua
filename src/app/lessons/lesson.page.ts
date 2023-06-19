import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lesson } from '../model/lessons.model';
import { LessonService } from '../services/lesson.service';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss']
})
export class LessonPage implements OnInit {

  lessons: Lesson[] | undefined;
  userLesson: Lesson = {} as Lesson;

  constructor(private router: Router, private authentificationService: AuthentificationService, private lessonService: LessonService) {
    console.log('coucou');
   }

  ngOnInit(): void {
    this.userLesson = this.authentificationService.user.lesson;
    this.lessons = this.lessonService.lessons;
  }

  goTo(routing: string, unlocked: boolean) {
    if(true) {
      this.router.navigate(['tabs/lessons/' + routing]);
    }
  }
}
