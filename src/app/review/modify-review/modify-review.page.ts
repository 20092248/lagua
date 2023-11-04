import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';

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

  constructor(private route: ActivatedRoute, private questionService: QuestionService, private authentificationService: AuthentificationService) { }

  ngOnInit() {
    this.user = this.authentificationService.user;
    const paramModifyReview = this.route.snapshot.paramMap.get('id');
    if (paramModifyReview) {
      this.questionService.getQuestions(this.user?.learn?.text.toLocaleLowerCase() + '_' + 'francais_questions', paramModifyReview).then(result =>{
        this.questions = result.qcm.questions;
        console.log(this.questions);
      });
    }
  }

  saveReview(questions: any){
    console.log(this.questions);
    console.log(questions);
  }

}
