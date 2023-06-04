import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-qcm',
  templateUrl: './qcm.page.html',
  styleUrls: ['./qcm.page.scss'],
})
export class QcmPage implements OnInit {

  translate: string = 'francais';
  user: User | undefined;
  questions: any[] = [];
  question: any;
  nbrQuestion: number = 0;
  displayAnswer: boolean = false;
  secondChance: boolean = false;
  answerSelected: any | undefined;
  radio_group: any;
  score: number = 0;

  constructor(private router: Router, private questionService: QuestionService, private authentificationService: AuthentificationService, private reviewService: ReviewService) { }

  ngOnInit() {
    this.questionService.nbrQuestion = this.nbrQuestion;
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions[this.nbrQuestion];
    this.getInfoReview();
  }

  choiceSelected(choice: any) {
    this.answerSelected = choice;
  }

  validate() {
    this.score = 0;
    this.displayAnswer = true;
    if(this.answerSelected && this.answerSelected.answer){
      if(!this.secondChance){
        this.score = 10;
      } else {
        this.score = 5;
      }
    } 
    console.log(this.answerSelected);
  }

  tryAgain() {
    this.secondChance = true;
    this.displayAnswer = false;
    this.answerSelected = undefined;
    this.radio_group = {};
  }

  continue() {
    this.saveScore();
    this.nbrQuestion++;
    this.questionService.nbrQuestion++;
    this.displayAnswer = false;
    this.secondChance = false;
    this.answerSelected = undefined;
    this.radio_group = {};
    if(this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
    } else {
      this.router.navigate(['/questions/result']);
    }
    // this.questions.push(this.question);
    // this.questionService.updateQuestion(this.user?.learn?.text.toLocaleLowerCase() + '_' + this.translate + '_questions' , this.user?.review ? this.user.review : '1_1', this.questions).then();
  }

  saveScore() {
    if(this.score === 10) {
      const learned = this.question?.text;
      this.reviewService.resultReview.score += 10;
      this.reviewService.resultReview.learned.push(learned);
    } else if(this.score === 5) {
      const toLearn = this.question?.text;
      this.reviewService.resultReview.score += 5;
      this.reviewService.resultReview.toLearn.push(toLearn);
    } else {
      const toRevise = this.question?.text;
      this.reviewService.resultReview.toRevise.push(toRevise);
    }
    this.reviewService.resultReview.nbrQuestion++;
  }

  getInfoReview() {
    this.reviewService.resultReview.category = this.reviewService.review.category;
    this.reviewService.resultReview.lesson = this.reviewService.review.lesson;
    this.reviewService.resultReview.order = this.reviewService.review.order;
  }

}