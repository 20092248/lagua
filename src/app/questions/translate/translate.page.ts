import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AudioService } from 'src/app/services/audio.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.page.html',
  styleUrls: ['./translate.page.scss'],
})
export class TranslatePage implements OnInit {

  translate: string = 'francais';
  user: User | undefined;
  questions: any[] = [];
  question: any;
  displayAnswer: boolean = false;
  secondChance: boolean = false;
  error: boolean = false;
  radio_group: any;
  score: number = 0;
  translateSetting: any | undefined;
  response: any[] = [];
  choices: any[] = [];
  @Output()
  nextQuestionEvent: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private questionService: QuestionService, private authentificationService: AuthentificationService, private reviewService: ReviewService, private audioService: AudioService, private settingService: SettingService) { }

  get nbrQuestion() {
    return this.questionService.nbrQuestion;
  } 

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService, '#ffffff');
    this.translateSetting = this.settingService.questions?.translate;
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;
    this.getChoices();
  }

  addWord(choice: any) {
    this.response.push(choice);
  }

  removeWord(index: number) {
    if (!this.displayAnswer) {
      this.response.splice(index, 1);
    }
  }

  getChoices() {
    if (this.question && this.question.choices) {
      const choices = this.question?.choices as any[];
      choices.forEach(c => {
        const e = c?.choice.split(' ');
        const choicesConcat = this.choices.concat(e);
        this.choices = choicesConcat.filter((x, i) => choicesConcat.indexOf(x) === i);
        console.log(this.choices);
      });
    }
  }

  validate() {
    this.score = 0;
    this.displayAnswer = true;
    const goodAnswer = this.question.choices?.find((q: any) => q.answer);
    const myAnswer = this.response?.join(' ');
    if (myAnswer && goodAnswer && myAnswer === goodAnswer?.choice) {
      this.audioService.play('rightAnswer');
      if (!this.secondChance) {
        this.score = 10;
      } else {
        this.score = 5;
      }
    } else {
      this.audioService.play('wrongAnswer');
      this.error = true;
    }
    console.log(this.response);
  }

  tryAgain() {
    this.secondChance = true;
    this.displayAnswer = false;
    this.error = false;
    this.response = [];
    this.radio_group = {};
  }

  continue() {
    this.saveScore();
    this.questionService.nbrQuestion++;
    this.displayAnswer = false;
    this.secondChance = false;
    this.error = false;
    this.response = [];
    this.choices = [];
    this.radio_group = {};
    if (this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
      this.getChoices();
      this.nextQuestionEvent.emit(Math.floor(Math.random() * 4));
    } else {
      this.router.navigate(['/questions/result']);
    }
    // this.questions.push(this.question);
    // this.questionService.updateQuestion(this.user?.learn?.text.toLocaleLowerCase() + '_' + this.translate + '_questions' , this.user?.review ? this.user.review : '1_1', this.questions).then();
  }

  saveScore() {
    if (this.score === 10) {
      const learned = this.question?.text;
      this.reviewService.resultReview.score += 10;
      this.reviewService.resultReview.learned.push(learned);
    } else if (this.score === 5) {
      const toLearn = this.question?.text;
      this.reviewService.resultReview.score += 5;
      this.reviewService.resultReview.toLearn.push(toLearn);
    } else {
      const toRevise = this.question?.text;
      this.reviewService.resultReview.toRevise.push(toRevise);
    }
    this.reviewService.resultReview.nbrQuestion++;
  }

}