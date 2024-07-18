import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DialectEnum } from 'src/app/model/dialect.enum';
import { Dialect } from 'src/app/model/dialect.model';
import { ParamReview } from 'src/app/model/paramReview.model';
import { Question } from 'src/app/model/question.model';
import { User } from 'src/app/model/user.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { QuestionService } from 'src/app/services/question.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

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
  dialect: DialectEnum = DialectEnum.SHGC;
  userDialect: Dialect = {} as Dialect;
  questionInfo: Question = {} as Question;
  paramModifyReview: ParamReview = {} as ParamReview;
  questions: any[] = [];
  isOverlay: boolean | undefined;
  rawQuestions: string = '';
  id: string = '';

  constructor(private route: ActivatedRoute, private reviewService: ReviewService, private questionService: QuestionService, private authentificationService: AuthentificationService,
    private alertService: AlertService, private actionSheetCtrl: ActionSheetController, private settingService: SettingService) {
    const paramMap = this.route.snapshot.paramMap;
    this.paramModifyReview = Utils.paramReview(paramMap.get('category') || '', Number(paramMap.get('lesson')), Number(paramMap.get('order')));
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.user = this.authentificationService.user;
    this.dialect = this.authentificationService.dialect;
    this.userDialect = this.user.dialects[this.dialect];
    this.questionService.findQuestions(CONSTANTS.transcodeCollectionQuestions[this.user.dialectSelected.code], this.paramModifyReview).then((questionInfo: Question) => {
      this.questionInfo = questionInfo;
      this.questionInfo.questions = questionInfo.questions && questionInfo.questions.length ? questionInfo.questions : [{ type: '', sentence: false, description: '', img: '', text: '', translate: '', choices: [{ choice: '', answer: false }, { choice: '', answer: false }, { choice: '', answer: false }, { choice: '', answer: false }] }];
      this.questions = this.questionInfo.questions;
      this.id = this.questionInfo.id || '';
      this.rawQuestions = JSON.stringify(this.questions, (key, value) => key === 'img' ? undefined : value);
    });
  }

  updateQuestions() {
    this.questions = JSON.parse(this.rawQuestions);
  }

  saveReview() {
    this.confirmActionSheet();
  }

  addQuestion(index: number) {
    const question = { ...this.questions[index] };
    this.questions.splice(index + 1, 0, question);
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  copyReview() {
    this.settingService.createDocumentAndGenerateId(CONSTANTS.transcodeCollectionQuestions[this.user.dialectSelected.code], this.questionInfo).then((result) => {
      this.questions = result.questions;
      this.alertService.presentToast('Copie réussie', 3000, 'lagua');
    },
      () => this.alertService.presentToast('Erreur lors de la copie', 3000, 'lagua'));
  }

  async confirmActionSheet() {
    this.alertService.presentActionSheetConfirmation('Confirmer la modification ?', '', '').then(result => {
      if (this.id) {
        this.questionInfo.id = this.id;
      }
      if (result.role === 'selected' && this.questionInfo.id) {
        this.questionService.updateQuestion(CONSTANTS.transcodeCollectionQuestions[this.user.dialectSelected.code], this.questionInfo.id, this.questionInfo).then(() => {
          this.alertService.presentToast('La mise à jour a été effectué.', 2000, 'success');
        }, (e) => this.alertService.presentToast('Erreur lors de la mise à jour du questionnaire.' + e, 3000, 'danger'));
      }
    });
  }

}
