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
  constructor(private route: ActivatedRoute, private reviewService: ReviewService, private questionService: QuestionService, private authentificationService: AuthentificationService,
    private alertService: AlertService, private actionSheetCtrl: ActionSheetController, private settingService: SettingService) { 
      this.paramModifyReview.category = this.route.snapshot.paramMap.get('category') || '';
      this.paramModifyReview.lesson = Number(this.route.snapshot.paramMap.get('lesson'));
      this.paramModifyReview.order = Number(this.route.snapshot.paramMap.get('order'));
    }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.dialect = this.authentificationService.dialect;
    this.userDialect = this.user.dialects[this.dialect];
    this.questionService.findQuestions(CONSTANTS.transcodeQuestion[this.user.dialectSelected.code], this.paramModifyReview).then((questionInfo: Question) => {
      this.questionInfo = questionInfo;
    });
  }

  saveReview() {
    this.confirmActionSheet();
  }

  addQuestion(index: number) {
    const question = { ...this.questionInfo.qcm.questions[index] };
    this.questionInfo.qcm.questions.splice(index + 1, 0, question);
  }

  removeQuestion(index: number) {
    this.questionInfo.qcm.questions.splice(index, 1);
  }

  copyReview() {
    this.settingService.createDocumentAndGenerateId(CONSTANTS.transcodeQuestion[this.user.dialectSelected.code], this.questionInfo).then(()=>{
      this.alertService.presentToast('Copie réussie', 3000, 'lagua');
    },
    ()=> this.alertService.presentToast('Erreur lors de la copie', 3000, 'lagua'));
  }

  async confirmActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Confirmer la modification ?',
      // subHeader: JSON.stringify(this.questions, (key, value) => key === 'img' || key === 'choices' || key === 'description' ? undefined : value),
      buttons: [
        {
          text: 'Confirmer',
          role: 'confirm',
          data: {
            action: 'confirm',
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
    if (result.role === 'confirm' && this.questionInfo.id) {
      this.questionService.updateQuestion(CONSTANTS.transcodeQuestion[this.user.dialectSelected.code], this.questionInfo.id, this.questionInfo).then(() => {
        this.alertService.presentToast('La mise à jour a été effectué.', 2000, 'success');
      }, (e) => this.alertService.presentToast('Erreur lors de la mise à jour du questionnaire.' + e, 3000, 'danger'));
    }
  }

}
