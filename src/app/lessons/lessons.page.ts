import { Component, OnInit } from '@angular/core';
import { Lessons } from '../model/lessons.model';
import { LessonsService } from '../services/lessons.service';

@Component({
  selector: 'app-lessons',
  templateUrl: 'lessons.page.html',
  styleUrls: ['lessons.page.scss']
})
export class LessonsPage implements OnInit {

  lessons: Lessons[] | undefined;

  constructor(private lessonsService: LessonsService) { }

  ngOnInit(): void {
    this.lessonsService.searchLessons().then(((lessons: Lessons[]) => {
      console.log(lessons);
      this.lessons = lessons;
    }));
  }
}
