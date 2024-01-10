import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, PopoverController, RefresherCustomEvent, ToastController } from '@ionic/angular';
import { Lesson } from '../model/lessons.model';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';
import { LessonService } from '../services/lesson.service';
import { ThemeService } from '../services/theme.service';
import { ModalController } from '@ionic/angular';
import { ReviewService } from '../services/review.service';
import { Review } from '../model/review.model';
import { SettingService } from '../services/setting.service';
import { LoadingService } from '../services/loading.service';
import { forkJoin } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { ReviewGroup } from '../model/reviewGroup.model';
import { Utils } from '../utils/utils';
import { AlertService } from '../services/alert.service';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { CONSTANTS } from '../utils/constants';
import { Dialect } from '../model/dialect.model';
import { Dialects } from '../model/dialects.model';
import { DialectEnum } from '../model/dialect.enum';
import { CodeLabel } from '../model/codeLabel.model';
register();

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  currentDate: Date = new Date();
  progression: number = 0;
  initial: string = '';
  previousReviewLoaded: boolean = false;
  previousReviewLoadedLength: number[] = [];
  setting: any = {};
  levelDialog: string = '';
  otherDialects: CodeTextTranslate[] = [];
  dialectLearned: string = '';
  uploadSetting: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService, private alertService: AlertService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService, private toastController: ToastController) { }

  get theme() {
    return this.themeService.themeMode;
  }
  get previousReviews() {
    return this.reviewService.previousReviews;
  }
  set setReview(review: any) {
    this.reviewService.review = review;
  }
  get user() {
    return this.authentificationService.user;
  }
  get dialect() {
    return this.authentificationService.dialect;
  }
  get userDialect() {
    return this.user.dialects[this.dialect];
  }
  get recommendedLessons() {
    return this.lessonService.lessons;
  }

  ngOnInit() {
    this.initial = !this.user.photoURL && this.user.displayName ? Utils.getInitial(this.user.displayName) : '';
    const numberPreviousReview = this.userDialect.resultReviews ? this.userDialect.resultReviews.length : 0;
    this.previousReviewLoadedLength = Array(numberPreviousReview).fill(undefined, 0, numberPreviousReview).map((x, i) => i);
    this.loadingService.present('Chargement...');
    forkJoin([this.settingService.getSettings(), this.reviewService.getAllReviews(), this.lessonService.searchLessons()]).subscribe(([setting, reviewsInfo, lessons]) => {
      this.loadingService.dismiss();
      this.setting = setting;
      this.levelDialog = Utils.getLevelDialog(this.setting.reviews?.categories, this.userDialect.review?.category);
      this.progression = this.user && this.userDialect.resultReviews && this.userDialect.resultLessons ? (this.userDialect.resultReviews?.length + this.userDialect.resultLessons?.length) / (Utils.getReviewsLength(reviewsInfo) + lessons.length) * 100 : 0;
      this.otherDialects = setting.userInformation.learn.filter((d: CodeTextTranslate) => d.code !== CONSTANTS.FRENCH_DIALECT && d.code !== this.user.dialectSelected.code);
      this.dialectLearned = CONSTANTS.transcodeDialectLabel[this.user.dialectSelected.code];
      this.uploadSetting.emit(this.setting);
    });
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

  handleRefresh(event: any) {
    this.ngOnInit();
    event.target.complete();
  }

  changeMode() {
    this.themeService.setAppTheme(this.theme);
  }

  dismissPopover() {
    if (this.authentificationService) {
      this.popoverController.dismiss();
    }
  }

  displayPreviousReviews() {
    this.previousReviewLoaded = false;
    this.reviewService.getPreviousReviews(this.userDialect.review).then(() => { this.previousReviewLoaded = true; });
  }

  accessPreviousReview(review: Review) {
    this.setReview = review;
    this.router.navigate(['/questions']);
  }

  accessToReview() {
    this.setReview = this.userDialect.review;
    this.router.navigate(['/questions']);
  }

  changeDialect(data: CodeTextTranslate) {
    this.alertService.presentAlertWithRadio('Comment jugerez-vous vos connaissances en ' + CONSTANTS.transcodeDialectLabelWithoutNoun[data.code] + '? ', this.setting.userInformation.level).then(alertResult => {
      if (alertResult.role === 'validate' && alertResult.data.values) {
        this.alertService.presentActionSheetConfirmation('Confirmation', CONSTANTS.CONFIRM_ACTION_SHEET).then(actionSheetResult => {
          if (actionSheetResult.role === 'selected') {
            this.authentificationService.dialect = Utils.findDialect(data.code);
            this.user.dialectSelected = data;
            this.createDialectsIfNotExist();
            this.addNewDialectInfo(alertResult);
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
  
  addNewDialectInfo(alertResult: any) {
    const why = { ...this.userDialect.why };
    const age = { ...this.userDialect.age };
    const time = { ...this.userDialect.time };
    this.userDialect.learn = this.user.dialectSelected;
    this.userDialect.why = why;
    this.userDialect.age = age;
    this.userDialect.time = time;
    this.userDialect.level = this.setting.userInformation.level.find((l: any) => l.code === alertResult.data.values);
    this.userDialect.resultReviews = [];
    this.userDialect.resultLessons = [];
    forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(async ([firstReview, firstLesson]) => {
      this.userDialect.resultReviews = [];
      this.userDialect.resultLessons = [];
      this.userDialect.review = firstReview;
      this.userDialect.lesson = firstLesson;
      this.otherDialects = this.setting.userInformation.learn.filter((d: CodeTextTranslate) => d.code !== CONSTANTS.FRENCH_DIALECT && d.code !== this.user.dialectSelected.code);
      this.authentificationService.addDialect(this.user.uid).then(() => {
        this.alertService.presentToast(CONSTANTS.CONFIRM_DIALECT_CHANGED, 3000, 'dark');
      });
    });
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.goTo('/firstpage', true, true);
    });
  }

  getDailyIcon(infoDay: any) {
    if (infoDay) {
      const todayMinusOneWeek = new Date();
      const utcDay = todayMinusOneWeek.getUTCDay() ? todayMinusOneWeek.getUTCDay() : 7;
      if (utcDay > infoDay.day) {
        todayMinusOneWeek.setDate(todayMinusOneWeek.getDate() - 7);
        if (infoDay.timestamp.toDate().getTime() > todayMinusOneWeek.getTime()) {
          return "checkbox-outline";
        }
      } else if (utcDay == infoDay.day) {
        return "checkbox-outline";
      }
    }
    return "square-outline";
  }

  displayUnknownUser() {
    this.user.photoURL = this.setting.profile.icon?.unknownUserSrc;
  }

}
