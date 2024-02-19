import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AudioService } from 'src/app/services/audio.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-mix',
  templateUrl: './mix.page.html',
  styleUrls: ['./mix.page.scss'],
})
export class MixPage implements OnInit {

  typeDisplay: number;
  translate: string = 'francais';
  user: User | undefined;
  questions: any[] = [];
  question: any;
  nbrQuestion: number = 0;
  displayAnswer: boolean = false;
  correct: string | undefined;
  answerSelected: any | undefined;
  radio_group: any;
  isOpen: boolean = false;
  score: number = 0;
  secondChance: boolean = false;
  error: boolean = false;
  translateSetting: any | undefined;
  response: any[] = [];

  constructor(private router: Router, private questionService: QuestionService, private authentificationService: AuthentificationService, private reviewService: ReviewService, private audioService: AudioService, private settingService: SettingService) {
    this.typeDisplay = 0; //Math.floor(Math.random() * 3);
  }

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService,  '#ffffff');
    //memo
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;
    setTimeout(() => { this.isOpen = true }, 2000);

    //qcm
    this.questionService.nbrQuestion = this.nbrQuestion;
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;

    //translate
    this.questionService.nbrQuestion = this.nbrQuestion;
    this.translateSetting = this.settingService.questions?.translate;
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;
  }

  nextQuestion(event: any) {
    console.log(event);
  }

  //memo
  isCorrect(response: boolean) {
    this.typeDisplay = Math.floor(Math.random() * 3);
    this.correct = response ? 'success' : 'danger';
    this.saveScore(response);
    setTimeout(() => {
      this.isOpen = false;
      this.answerSelected = undefined;
      this.displayAnswer = false;
      this.correct = undefined;
      this.nbrQuestion++;
      this.questionService.nbrQuestion++;
      if (this.nbrQuestion !== this.questions.length) {
        this.question = this.questions[this.nbrQuestion];
        setTimeout(() => { this.isOpen = true }, 2000);
      } else {
        this.router.navigate(['/questions/result']);
      }
    }, 1000);
  }

  saveScore(response: boolean) {
    if (this.typeDisplay === 0) { //memo
      if (response) {
        this.audioService.play('rightAnswer');
        const learned = this.question?.text;
        this.reviewService.resultReview.score += 10;
        this.reviewService.resultReview.learned.push(learned);
      } else {
        this.audioService.play('wrongAnswer');
        const toRevise = this.question?.text;
        this.reviewService.resultReview.toRevise.push(toRevise);
      }
      this.reviewService.resultReview.nbrQuestion++;
    }
    else if (this.typeDisplay === 1 || this.typeDisplay === 2) { //qcm or translate
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

  //qcm
  choiceSelected(choice: any) {
    this.answerSelected = choice;
  }

  validate() {
    if (this.typeDisplay === 1) { //qcm
      this.score = 0;
      this.displayAnswer = true;
      if (this.answerSelected && this.answerSelected.answer) {
        this.audioService.play('rightAnswer');
        if (!this.secondChance) {
          this.score = 10;
        } else {
          this.score = 5;
        }
      } else {
        this.audioService.play('wrongAnswer');
      }
      console.log(this.answerSelected);
    } else if (this.typeDisplay === 2) { //translate
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
  }

  tryAgain() {
    this.secondChance = true;
    this.displayAnswer = false;
    this.displayAnswer = false;
    this.error = false;
    this.answerSelected = undefined;
    this.response = [];
    this.radio_group = {};
  }

  continue() {
    this.saveScore(false);
    this.nbrQuestion++;
    this.questionService.nbrQuestion++;
    this.displayAnswer = false;
    this.secondChance = false;
    this.answerSelected = undefined;
    this.radio_group = {};
    if (this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
    } else {
      this.router.navigate(['/questions/result']);
    }
    this.typeDisplay = Math.floor(Math.random() * 3);
    Utils.customCapacitorQuestion(this.settingService, this.typeDisplay ? '#eef1ee' : '#ffffff');
  }

  //translate
  addWord(choice: any, index: number) {
    this.response.push(choice);
  }

  removeWord(choice: any, index: number) {
    this.response.splice(index, 1);
  }

}
