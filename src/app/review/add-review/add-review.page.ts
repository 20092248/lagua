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

  form: FormGroup;
  collection: any = { name: '', from: '' };

  constructor(private dictionaryService: DictionaryService, private reviewService: ReviewService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      'collection': [''],
      'from': ['']
    });
  }

  ngOnInit() {
    // this.dictionaryService.copyCollection('shindzuani_francais_questions', '');
  }

  addReview() {
    this.reviewService.copyCollection('shindzuani_francais_questions', 'A1', '2')
  }

}
