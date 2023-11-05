import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-modify-review',
  templateUrl: './modify-review.page.html',
  styleUrls: ['./modify-review.page.scss'],
})
export class ModifyReviewPage implements OnInit {

  category: string = '';
  lesson: number = 0;
  order: number = 0;
  user: User = {} as User;
  questions: any[] = [];
  paramModifyReview: string = '';
  constructor(private route: ActivatedRoute, private reviewService: ReviewService, private questionService: QuestionService, private authentificationService: AuthentificationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.paramModifyReview = this.route.snapshot.paramMap.get('id') || '';
      this.questionService.getQuestions(this.user?.learn?.text.toLocaleLowerCase() + '_' + 'francais_questions', this.paramModifyReview).then(result =>{
        this.questions = result.qcm.questions;
      });
  }

  saveReview(){
    console.log(this.questions);
    // this.questionService.updateQuestion(this.user?.learn?.text.toLocaleLowerCase() + '_' + 'francais_questions', this.paramModifyReview, this.questions).then(result=>{
    //   this.alertService.presentToast('La mise à jour a été effectué.', 1000, 'success');
    // }, () => this.alertService.presentToast('Erreur lors de la mise à jour du questionnaire.', 1000, 'error'));
  }

  addQuestion(index: number) {
    this.questions.splice(index + 1, 0, this.questions[index]);
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

}
