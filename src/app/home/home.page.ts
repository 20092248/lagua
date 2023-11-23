import { Component, OnInit, ViewChild } from '@angular/core';
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
  get recommendedLessons() {
    return this.lessonService.lessons;
  }

  ngOnInit() {
    this.initial = !this.user.photoURL && this.user.displayName ? Utils.getInitial(this.user.displayName) : '';
    const numberPreviousReview = this.user.resultReviews ? this.user.resultReviews.length : 0;
    this.previousReviewLoadedLength = Array(numberPreviousReview).fill(undefined, 0, numberPreviousReview).map((x,i)=>i);
    this.loadingService.present('Chargement...');
    forkJoin([this.settingService.getSettings(), this.reviewService.getAllReviews(), this.lessonService.searchLessons()]).subscribe(([setting, reviewsInfo, lessons]) => {
        this.loadingService.dismiss();
        this.setting = setting;
      this.progression = this.user && this.user.resultReviews && this.user.resultLessons ? (this.user.resultReviews?.length + this.user.resultLessons?.length) / (Utils.getReviewsLength(reviewsInfo) + lessons.length) * 100 : 0;
    });
  }

  goTo(routing: string, lessonUnlock: boolean, dismissPopover: boolean) {
    if (lessonUnlock) {
      this.router.navigate([routing]);
      if (dismissPopover) {
        this.dismissPopover();
      }
    } else {
      this.alertService.presentToast('Impossible de visualiser cette leçon.', 2000, 'danger');
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
    this.reviewService.getPreviousReviews(this.user.review).then(() => { this.previousReviewLoaded = true; });
  }

  accessPreviousReview(review: Review) {
    this.setReview = review;
    this.router.navigate(['/questions']);
  }

  accessToReview() {
    this.setReview = this.authentificationService.user.review;
    this.router.navigate(['/questions']);
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.goTo('/firstpage', false, true);
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

}
