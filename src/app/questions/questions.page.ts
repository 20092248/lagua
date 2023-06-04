import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { ReviewService } from '../services/review.service';
import { ResultReview } from '../model/resultReview.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  constructor(private questionService: QuestionService, private reviewService: ReviewService) { }
  get getType(){
    return this.questionService.type;
  }

  get nbrQuestion() {
    return (this.questionService.nbrQuestion / this.questionService.questions?.qcm?.questions?.length) * 100;
  }

  ngOnInit() {
    this.resetReview();
   }

   resetReview() {
    this.reviewService.resultReview = new ResultReview();
  }
}
