import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'ngx-lottie/lib/symbols';
import { Question } from 'src/app/model/question.model';
import { User } from 'src/app/model/user.model';
import { AudioService } from 'src/app/services/audio.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-mix',
  templateUrl: './mix.page.html',
  styleUrls: ['./mix.page.scss'],
})
export class MixPage implements OnInit {

  typeDisplay: string;
  newReview: boolean = false;
  animation: AnimationItem = {} as AnimationItem;
  options: AnimationOptions = { path: 'https://assets9.lottiefiles.com/packages/lf20_ydn9vde0.json' };

  constructor(private ngZone: NgZone, private router: Router, private route: ActivatedRoute, private questionService: QuestionService, private settingService: SettingService) {
    this.typeDisplay = 'L'; //CONSTANTS.transcodeTypeQuestion[Math.floor(Math.random() * 4)];
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
        this.newReview = this.router.getCurrentNavigation()?.extras?.state?.['newReview'];
        this.typeDisplay = 'L';//this.questions[this.nbrQuestion].type;
      }
    });
  }

  get questions() {
    return this.questionService.questions?.questions;
  }
  get nbrQuestion() {
    return this.questionService.nbrQuestion;
  }

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService, '#ffffff');
  }

  animationCreated(animation: any) {
    this.animation = animation;
    console.log(animation);
  }

  nextQuestion(random: any) {
    if (this.newReview) {
      this.typeDisplay = this.questions[this.nbrQuestion].type;
    } else {
      this.typeDisplay = CONSTANTS.transcodeTypeQuestion[random]; //Math.floor(Math.random() * 4);
    }
  }

}
