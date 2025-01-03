import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { ReviewService } from '../services/review.service';
import { ResultReview } from '../model/resultReview.model';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit {

  isOverlay: boolean | undefined;

  constructor(private questionService: QuestionService, private reviewService: ReviewService, private settingService: SettingService) { }
  
  get getType(){
    return this.questionService.type;
  }
  get nbrQuestion() {
    return (this.questionService.nbrQuestion / this.questionService.questions?.questions?.length) * 100;
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.resetReview();
   }

   resetReview() {
    this.questionService.nbrQuestion = 0;
    this.reviewService.resultReview = new ResultReview();
  }
}
