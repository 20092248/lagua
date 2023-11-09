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

  user: User = {} as User;
  recommendedLessons: Lesson[] = [];
  reviews: Review[] = [];
  currentDate: Date = new Date();
  dailyIcon: string = '';
  loading: HTMLIonLoadingElement | undefined;
  progression: number = 0;
  initial: string = '';

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService, private alertService: AlertService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService, private toastController: ToastController) { }
  get getTheme() {
    return this.themeService.themeMode;
  }

  get getPreviousReviews() {
    return this.reviewService.previousReviews;
  }

  get getReview() {
    return this.authentificationService.user.review;
  }

  ngOnInit() {
    this.user = this.authentificationService.user;
    this.initial = !this.user.photoURL && this.user.displayName ? Utils.getInitial(this.user.displayName) : '';
    forkJoin([this.settingService.getSettings(), this.reviewService.getAllReviews(), this.lessonService.searchLessons()]).subscribe(([settings, reviewsInfo, lessons]) => {
      this.recommendedLessons = [];
      this.progression = this.user && this.user.resultReviews && this.user.resultLessons ? (this.user.resultReviews?.length + this.user.resultLessons?.length) / (this.getReviewsLength(reviewsInfo) + lessons.length) * 100 : 0;
      this.recommendedLessons = lessons;
    });
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.goTo('/firstpage', true);
    });
  }

  goTo(routing: string, dissmissPopover: boolean) {
    this.router.navigate([routing]);
    if (dissmissPopover) {
      this.dismissPopover();
    }
  }

  goToLesson(routing: string, lessonUnlock: boolean) {
    if (lessonUnlock) {
      this.router.navigate([routing]);
    } else {
      this.alertService.presentToast('Impossible de visualiser cette leçon.', 2000, 'danger');
    }
  }

  getReviewsLength(reviewsInfo: ReviewGroup[]) {
    var length = 0;
    reviewsInfo.forEach(reviewInfo => {
      reviewInfo.reviews.forEach(r => {
        length += 1;
      })
    });
    return length;
  }

  handleRefresh(event: any) {
    this.ngOnInit();
    event.target.complete();
  }

  changeMode() {
    this.themeService.setAppTheme(this.getTheme);
  }

  dismissPopover() {
    if (this.authentificationService) {
      this.popoverController.dismiss();
    }
  }

  displayPreviousReviews() {
    this.reviewService.getPreviousReviews(this.getReview).then(() => { });
  }

  accessPreviousReview(review: Review) {
    this.reviewService.review = review;
    this.router.navigate(['/questions']);
  }

  accessToReview() {
    this.reviewService.review = this.authentificationService.user.review;
    this.router.navigate(['/questions']);
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
