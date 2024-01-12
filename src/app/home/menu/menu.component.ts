import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { CodeTextTranslate } from 'src/app/model/codeTextTranslate.model';
import { DialectEnum } from 'src/app/model/dialect.enum';
import { Dialect } from 'src/app/model/dialect.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { LessonService } from 'src/app/services/lesson.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';
import { ThemeService } from 'src/app/services/theme.service';
import { CONSTANTS } from 'src/app/utils/constants';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  initial: string = '';
  otherDialects: CodeTextTranslate[] = [];
  dialectLearned: string = '';
  @Input() uploadSetting: EventEmitter<any> | undefined;

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService, private alertService: AlertService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService, private toastController: ToastController) { }

  get user() {
    return this.authentificationService.user;
  }
  get dialect() {
    return this.authentificationService.dialect;
  }
  get userDialect() {
    return this.user.dialects[this.dialect];
  }

  ngOnInit() {
    if (this.uploadSetting) {
      this.uploadSetting.subscribe(data => {
        this.settingService.profile = data.profile;
        this.settingService.userInformation = data.userInformation;
        this.otherDialects = this.settingService.userInformation.learn?.filter((d: CodeTextTranslate) => d.code !== CONSTANTS.FRENCH_DIALECT && d.code !== this.user.dialectSelected.code);
        this.dialectLearned = CONSTANTS.transcodeDialectLabel[this.user.dialectSelected.code];
      });
    }
  }

  changeDialect(data: CodeTextTranslate) {
    const oldDialect = JSON.parse(JSON.stringify(this.dialect)) as DialectEnum;
    this.alertService.presentAlertWithRadio('Comment jugerez-vous vos connaissances en ' + CONSTANTS.transcodeDialectLabelWithoutNoun[data.code] + '? ', this.settingService.userInformation.level).then(alertResult => {
      if (alertResult.role === 'validate' && alertResult.data.values) {
        this.alertService.presentActionSheetConfirmation('Confirmation', CONSTANTS.CONFIRM_ACTION_SHEET).then(actionSheetResult => {
          if (actionSheetResult.role === 'selected') {
            this.authentificationService.dialect = Utils.findDialect(data.code);
            this.user.dialectSelected = data;
            this.createDialectsIfNotExist();
            this.addNewDialectInfo(alertResult, oldDialect);
            this.dialectLearned = CONSTANTS.transcodeDialectLabel[this.user.dialectSelected.code];
          }
        });
      } else if (alertResult.role === 'validate' && !alertResult.data.values) {
        this.alertService.presentToast(CONSTANTS.CHOICE_DIALECT_MISSING, 3000, 'danger');
      }
    });
  }

  createDialectsIfNotExist() {
    if (!this.user.dialects[this.dialect]) {
      this.user.dialects[this.dialect] = {} as Dialect;
      this.user.dialects[this.dialect].resultReviews = [];
      this.user.dialects[this.dialect].resultLessons = [];
    }
  }

  addNewDialectInfo(alertResult: any, oldDialect: DialectEnum) {
    this.userDialect.learn = this.user.dialectSelected;
    this.userDialect.why = this.user.dialects[oldDialect].why;
    this.userDialect.age = this.user.dialects[oldDialect].age;
    this.userDialect.time = this.user.dialects[oldDialect].time;
    this.userDialect.level = this.settingService.userInformation.level.find((l: any) => l.code === alertResult.data.values);
    this.userDialect.resultReviews = [];
    this.userDialect.resultLessons = [];
    forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(async ([firstReview, firstLesson]) => {
      this.userDialect.resultReviews = [];
      this.userDialect.resultLessons = [];
      this.userDialect.review = firstReview;
      this.userDialect.lesson = firstLesson;
      this.otherDialects = this.settingService.userInformation.learn.filter((d: CodeTextTranslate) => d.code !== CONSTANTS.FRENCH_DIALECT && d.code !== this.user.dialectSelected.code);
      this.authentificationService.addDialect(this.user.uid).then(() => {
        this.alertService.presentToast(CONSTANTS.CONFIRM_DIALECT_CHANGED, 3000, 'dark');
      });
    });
  }

  dismissPopover() {
    if (this.authentificationService) {
      this.popoverController.dismiss();
    }
  }

  displayUnknownUser() {
    this.user.photoURL = this.settingService.profile.icon?.unknownUserSrc;
  }

  goTo(routing: string, lessonUnlock: boolean, dismissPopover: boolean) {
    if (lessonUnlock) {
      this.router.navigate([routing]);
      if (dismissPopover) {
        this.dismissPopover();
      }
    } else {
      this.alertService.presentToast('Débloquer les précedentes leçons avant d\'accéder à la leçon.', 3000, 'lagua');
    }
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.goTo('/firstpage', true, true);
    });
  }
}
