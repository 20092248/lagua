import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lesson } from '../model/lessons.model';
import { LessonService } from '../services/lesson.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.page.html',
  styleUrls: ['lesson.page.scss']
})
export class LessonPage implements OnInit {

  lessons: Lesson[] | undefined;

  constructor(private router: Router, private lessonService: LessonService) { }

  ngOnInit(): void {
    this.lessons = this.lessonService.lessons;
  }

  goTo(routing: string) {
    this.router.navigate(['tabs/lessons/' + routing]);
  }
}
