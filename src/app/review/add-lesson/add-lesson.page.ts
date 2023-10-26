import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-add-lesson',
  templateUrl: './add-lesson.page.html',
  styleUrls: ['./add-lesson.page.scss'],
})
export class AddLessonPage implements OnInit {

  formLesson: FormGroup;
  category: string = 'A1';
  lesson: number = 1;
  order: number = 4;
  fromCategory: string = 'A1';
  fromLesson: number = 1;
  fromOrder: number = 2;

  constructor(private dictionaryService: DictionaryService, private reviewService: ReviewService, private formBuilder: FormBuilder) {
    this.formLesson = this.formBuilder.group({ 'category': [''], 'lesson': [0], 'order': [0], 'fromCategory': ['A1'], 'fromLesson': [0], 'fromOrder': [0] });
  }

  ngOnInit() {
    // this.dictionaryService.copyCollection('shindzuani_francais_questions', '');
  }

  addLesson() {
    this.reviewService.updateLessonInReview('shindzuani_francais_questions', this.category, String(this.lesson), String(this.order), this.fromCategory, String(this.fromLesson), String(this.fromOrder));
  }

}
