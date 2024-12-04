import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  questions: any[] = [];
  question: any;
  countDownActive: boolean = true;
  @Output()
  nextQuestionEvent: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private questionService: QuestionService, private reviewService: ReviewService) { }

  get nbrQuestion() {
    return this.questionService.nbrQuestion;
  }

  ngOnInit() {
    this.questions = this.questionService.questions?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;
    this.countDownActive = Utils.countdownMixOrRestart(this.questionService.type);
  }

  continue() {
    if (this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
      this.nextQuestionEvent.emit(Math.floor(Math.random() * 4));
    } else {
      this.router.navigate(['/questions/result']);
    }
  }

  setCountDownActive(event: any) {
    this.countDownActive = false;
  }

}
