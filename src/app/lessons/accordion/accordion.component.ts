import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Lesson } from 'src/app/model/lesson.model';
import { LessonService } from 'src/app/services/lesson.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {

  contents: any[] = [];
  @Input() lessonCode: string = '';
  @Input() dialectCode: string = '';
  @Output() orderEvent = new EventEmitter<number>();

  constructor(private lessonService: LessonService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.lessonService.getLessonByCode(this.lessonCode).then(((result: Lesson) => {
      this.contents = result.content[this.dialectCode];
      this.orderEvent.emit(result.order);
    }));
  }

  convertToHtml(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
