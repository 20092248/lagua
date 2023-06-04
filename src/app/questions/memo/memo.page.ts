import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.page.html',
  styleUrls: ['./memo.page.scss'],
})
export class MemoPage implements OnInit {

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

  constructor(private router: Router, private questionService: QuestionService, private authentificationService: AuthentificationService, private reviewService: ReviewService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions.slice(0,2);
    this.question = this.questions[this.nbrQuestion];
    setTimeout(() => { this.isOpen = true }, 2000);
  }

  isCorrect(response: boolean) {
    this.correct = response ? 'success' : 'danger';
    this.saveScore(response);
    setTimeout(() => {
      this.isOpen = false;
      this.answerSelected = undefined;
      this.displayAnswer = false;
      this.correct = undefined;
      this.nbrQuestion++;
      this.questionService.nbrQuestion++;
      if(this.nbrQuestion !== this.questions.length) {
      this.question = this.questions[this.nbrQuestion];
    } else {
      this.router.navigate(['/questions/result']);
    }
    }, 1000);
  }

  saveScore(response: boolean) {
    if(response) {
      const learned = this.question?.text;
      this.reviewService.resultReview.score += 10;
      this.reviewService.resultReview.learned.push(learned);
    } else {
      const toRevise = this.question?.text;
      this.reviewService.resultReview.toRevise.push(toRevise);
    }
    this.reviewService.resultReview.nbrQuestion++;
  }

}
