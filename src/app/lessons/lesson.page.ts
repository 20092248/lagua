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

  constructor(private route: ActivatedRoute, private router: Router, private authentificationService: AuthentificationService, private lessonService: LessonService) { }

  get userLesson() {
    return this.authentificationService.user.lesson;
  }
  get lessons() {
    return this.lessonService.lessons;
  }
  set setLessons(lessons: any) {
    this.lessonService.lessons = lessons;
  }

  ngOnInit(): void {
    if (!this.lessons.length) {
      this.lessonService.searchLessons().then(lessons => {
        this.setLessons(lessons);
      })
    }
  }

  goTo(lesson: Lesson) {
    const navigationExtras: NavigationExtras = {
      state: { data: lesson }
    };
    this.router.navigate(['tabs/lessons/' + lesson.navigate], navigationExtras);
  }
}
