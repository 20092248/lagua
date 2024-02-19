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
  selector: 'app-spell',
  templateUrl: './spell.page.html',
  styleUrls: ['./spell.page.scss'],
})
export class SpellPage implements OnInit {

  translate: string = 'francais';
  user: User | undefined;
  questions: any[] = [];
  question: any;
  nbrQuestion: number = 0;
  displayAnswer: boolean = false;
  secondChance: boolean = false;
  score: number = 0;
  letters: string[] = [];
  response: string[] = [];
  positions: number[] = [];
  @Output()
  nextQuestionEvent: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private questionService: QuestionService, private authentificationService: AuthentificationService,
    private reviewService: ReviewService, private audioService: AudioService, private settingService: SettingService) { }

  ngOnInit() {
    Utils.customCapacitorQuestion(this.settingService, '#ffffff');
    this.questionService.nbrQuestion = this.nbrQuestion;
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions ? this.questions[this.nbrQuestion] : undefined;
    this.mixLetter();
  }

  addLetter(letter: any, index: number) {
    this.response.push(letter);
    this.positions.push(index);
  }

  removeLetter(index: number) {
    if(!this.displayAnswer){
      this.response.splice(index, 1);
      this.positions.splice(index, 1);
    }
  }

  mixLetter() {
    const textSplit = this.question.text.split('');
    for (var i = 0; i < textSplit.length; i++) {
      const replacePosition = Math.floor(Math.random() * this.question.text.length);
      const randomLetter = textSplit.splice(replacePosition, 1);
      const replacePosition2 = Math.floor(Math.random() * this.question.text.length);
      textSplit.splice(replacePosition2, 0, randomLetter[0]);
      console.log(textSplit);
    }
    this.letters = textSplit;
  }

  validate() {
    this.score = 0;
    this.displayAnswer = true;
    if (this.question.text === this.response.join('')) {
      this.audioService.play('rightAnswer');
      if (!this.secondChance) {
        this.score = 10;
      } else {
        this.score = 5;
      }
    } else {
      this.audioService.play('wrongAnswer');
    }
  }

  tryAgain() {
    this.secondChance = true;
    this.displayAnswer = false;
    this.response = [];
    this.positions = [];
  }

  continue() {
    this.saveScore();
    this.nbrQuestion++;
    this.letters = [];
    this.response = [];
    this.positions = [];
    this.questionService.nbrQuestion++;
    this.displayAnswer = false;
    this.secondChance = false;
    if (this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
      this.mixLetter();
      this.nextQuestionEvent.emit();
    } else {
      this.router.navigate(['/questions/result']);
    }
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