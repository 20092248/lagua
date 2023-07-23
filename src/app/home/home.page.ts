import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, PopoverController, ToastController } from '@ionic/angular';
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
  previousReviews: Review[] = [];
  review: Review | undefined;
  currentDate: Date = new Date();
  dailyIcon: string = '';
  loading: HTMLIonLoadingElement | undefined;
  progression: number = 0;

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService, private toastController: ToastController) {
  }
  get getTheme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    this.user = this.authentificationService.user;
    forkJoin([this.settingService.getSettings(), this.reviewService.getAllReviews(), this.lessonService.searchLessons()]).subscribe(([settings, reviews, lessons]) => {
      this.recommendedLessons = [];
      this.previousReviews = [];
      this.progression = this.user && this.user.resultReviews && this.user.resultLessons ? (this.user.resultReviews?.length + this.user.resultLessons?.length) / (reviews.length + lessons.length) * 100 : 0;
      reviews.sort((a, b) => a.category < b.category ? -1 : 1).sort((a, b) => a.lesson - b.lesson).sort((a, b) => a.order - b.order).every(r => {
        if (this.user?.review && this.user?.review.category === r.category && this.user?.review.lesson === r.lesson && this.user?.review.order === r.order) {
          return;
        }
        this.previousReviews.push(r);
      });
      this.review = this.user?.review;
      // this.reviewService.findNextReview(this.authentificationService.user.review).then(review => {
      //   this.review = review;
      // });
      this.recommendedLessons = lessons; //this.lessonService.getRecommendedLesson(this.user && this.user.level ? this.user.level.code : '0', lessons);
    });
  }

  logout() {
    this.authentificationService.logout().then(() => {
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
      this.presentToast();
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Impossible de visualiser cette leçon.',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });

    await toast.present();
  }

  async showLoading() {
    this.loadingService.present('Récupération des données utilisateur...');
  }

  async stopLoading() {
    this.loadingService.dismiss();
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
    this.reviewService.getReviewsByCategory('A1').then((data: Review[]) => {
      this.reviews = data;
    });
  }

  accessPreviousReview(review: Review) {
    this.reviewService.review = review;
    this.router.navigate(['/questions']);
  }

  accessToReview() {
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
