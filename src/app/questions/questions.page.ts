import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { ReviewService } from '../services/review.service';
import { ResultReview } from '../model/resultReview.model';
import { SettingService } from '../services/setting.service';
import { AdMobService } from '../services/admob.service';
import { Utils } from '../utils/utils';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.page.html',
  styleUrls: ['./questions.page.scss'],
})
export class QuestionsPage implements OnInit, OnDestroy {

  isOverlay: boolean | undefined;

  constructor(private questionService: QuestionService, private reviewService: ReviewService, private settingService: SettingService, private adMobService: AdMobService) {
    this.adMobService.showRewardVideo();
  }

  get getType() {
    return this.questionService.type;
  }
  get nbrQuestion() {
    return (this.questionService.nbrQuestion / this.questionService.questions?.questions?.length) * 100;
  }

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService, '#ffffff');
    this.questionService.type = '';
    this.isOverlay = this.settingService.isOverlay;
    this.resetReview();
  }

  ngOnDestroy() {
    Utils.customCapacitorTabs(this.settingService);
  }

  resetReview() {
    this.questionService.nbrQuestion = 0;
    this.reviewService.resultReview = new ResultReview();
  }
}
