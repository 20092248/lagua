import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {

  formReview: FormGroup;
  formMenu: FormGroup;
  category: string = '';
  lesson: number = 0;
  fromCategory: string = 'A1';
  fromLesson: number = 1;

  constructor(private dictionaryService: DictionaryService, private reviewService: ReviewService, private formBuilder: FormBuilder) {
    this.formReview = this.formBuilder.group({ 'category': [''], 'lesson': [0], 'fromCategory': ['A1'], 'fromLesson': [1] });
    this.formMenu = this.formBuilder.group({ 'category': [''], 'lesson': [0], 'fromCategory': ['A1'], 'fromLesson': [1] });
  }

  ngOnInit() {
    // this.dictionaryService.copyCollection('shindzuani_francais_questions', '');
  }

  addReview() {
    this.reviewService.copyCollection('shindzuani_francais_questions', this.category, String(this.lesson), this.fromCategory, String(this.fromLesson));
  }

  addMenu() {
    this.reviewService.copyDoc('reviews', this.category, this.lesson, this.fromCategory, this.fromLesson);
  }

}
