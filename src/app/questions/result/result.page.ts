import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultReview } from 'src/app/model/resultReview.model';
import { Review } from 'src/app/model/review.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  review: Review | undefined;
  categories: any[] = [];
  score: number = 0;
  toRevise: number = 0;
  scoreToRevise: number = 0;
  toLearn: number = 0;
  scoreToLearn: number = 0;
  learned: number = 0;
  scoreLearned: number = 0;
  ratings: number[] = Array(5).fill(undefined, 0, 5).map((x,i)=>i);
  star: number = 0;

  constructor(private router: Router, private reviewService: ReviewService, private settingService: SettingService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.review = this.reviewService.review;
    this.score = this.reviewService.resultReview?.score ? this.reviewService.resultReview?.score * 100 / (this.reviewService.resultReview?.nbrQuestion * 10) : 0;
    this.star = this.score / 20;
    this.toRevise = this.reviewService.resultReview.toRevise?.length;
    this.scoreToRevise = 360 * (this.reviewService.resultReview.toRevise?.length / this.reviewService.resultReview?.nbrQuestion);
    this.toLearn = this.reviewService.resultReview.toLearn?.length;
    this.scoreToLearn = 360 * (this.reviewService.resultReview.toLearn?.length / this.reviewService.resultReview?.nbrQuestion);
    this.learned = this.reviewService.resultReview.learned?.length;
    this.scoreLearned = 360 * (this.reviewService.resultReview.learned?.length / this.reviewService.resultReview?.nbrQuestion);
    if (!this.categories.length) {
      this.settingService.getSetting('reviews').then((data: any) => {
        this.categories = data.categories;
      });
    }
  }

  saveReview() {
    if(this.authentificationService.user.uid){
      this.authentificationService.updateResultReview(this.reviewService.resultReview, 'users', this.authentificationService.user.uid).then(()=>{
        this.resetReview();
        this.router.navigate(['/tabs/home']);
      });
    } else {
      console.error('Impossible de sauvegarder sans l\'identifiant de l\'utilisateur');
    }
  }

  resetReview() {
    this.reviewService.resultReview = new ResultReview();
  }

  displayLevel() {
    const code = this.review?.category;
    var label;
    this.categories.forEach(c => {
      if (c.code === code) {
        label = c.label;
      }
    });
    return label;
  }

  displayCircle(value: number) {
    return '-webkit-transform: rotate(' + value + 'deg); -moz-transform: rotate(' + value + 'deg); -ms-transform: rotate(' + value + 'deg); -o-transform: rotate(' + value + 'deg); transform: rotate(' + value + 'deg);'
  }

}