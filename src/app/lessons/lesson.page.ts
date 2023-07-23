import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private lessonService: LessonService) { 
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation()) {
        this.userLesson = this.authentificationService.user.lesson;
      }
    });
  }

  ngOnInit(): void {
    this.userLesson = this.authentificationService.user.lesson;
    this.lessons = this.lessonService.lessons;
  }

  goTo(lesson: Lesson) {
    const navigationExtras: NavigationExtras = {
      state: { data: lesson }
    };
    this.router.navigate(['tabs/lessons/' + lesson.navigate], navigationExtras);
  }
}
