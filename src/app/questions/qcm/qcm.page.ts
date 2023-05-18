import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/questions.service';

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
  answerSelected: any | undefined;
  radio: any;

  constructor(private questionService: QuestionService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.questionService.getQuestions(this.user?.learn?.text.toLocaleLowerCase() + '_' + this.translate + '_qcm', this.user?.review ? this.user.review : '1_1').then(value => {
      this.questions = value?.qcm?.questions;
      this.question = this.questions[this.nbrQuestion];
      console.log(this.question);
    });
  }

  choiceSelected(choice: any) {
    this.answerSelected = choice;
  }

  validate() {
    this.displayAnswer = true;
  }

  continue() {
    this.nbrQuestion++;
    this.displayAnswer = false;
    this.answerSelected = undefined;
    this.question = this.questions[this.nbrQuestion];
    // this.questionService.updateQuestion(this.user?.learn?.text.toLocaleLowerCase() + '_' + this.translate + '_qcm', this.user?.review ? this.user.review : '1_1', this.questions).then();
  }

}