import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/questions.service';

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

  constructor(private questionService: QuestionService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.questions = this.questionService.questions?.qcm?.questions;
    this.question = this.questions[this.nbrQuestion];
    setTimeout(() => { this.isOpen = true }, 2000);
  }

  isCorrect(response: boolean) {
    this.correct = response ? 'success' : 'danger';
    setTimeout(() => {
      this.answerSelected = undefined;
      this.nbrQuestion++;
      this.displayAnswer = false;
      this.correct = undefined;
      this.question = this.questions[this.nbrQuestion];
    }, 1000);

  }

}
