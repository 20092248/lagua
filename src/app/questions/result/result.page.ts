import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResultReview } from 'src/app/model/resultReview.model';
import { Review } from 'src/app/model/review.model';
import { AudioService } from 'src/app/services/audio.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

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
  scoreToReach: number = 2.5;
  trophySrc: string='';

  constructor(private router: Router, private reviewService: ReviewService, private settingService: SettingService, private authentificationService: AuthentificationService, private audioService: AudioService) { }

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService, '#ffffff');
    this.review = this.reviewService.review;
    this.score = this.reviewService.resultReview?.score ? this.reviewService.resultReview?.score * 100 / (this.reviewService.resultReview?.nbrQuestion * 10) : 0;
    this.star = this.score / 20;
    this.scoreToReach = this.reviewService.review.score ? this.reviewService.review.score / 20 : this.scoreToReach;
    if(this.star >= this.scoreToReach) {
      this.audioService.play('successReview');
    } else {
      this.audioService.play('failReview');
    }
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
    if(!this.trophySrc) {
      this.settingService.getSetting('questions').then((data: any) => {
        this.trophySrc = data.result.src;
      });
    }
  }

  saveReview() {
    if(this.authentificationService.user.uid){
      this.authentificationService.updateResultReview(this.reviewService.resultReview, this.authentificationService.user.uid).then(()=>{
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

  tryAgain(){
    this.reviewService.resultReview = new ResultReview();
    this.router.navigate(['/questions']);
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
