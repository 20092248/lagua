import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, PopoverController } from '@ionic/angular';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User | undefined;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 2.03,
    speed: 400,
  };
  recommendedLesson: Lesson[] = [];
  reviews: Review[] = [];
  previousReviews: Review[] = [];
  review: Review | undefined;
  currentDate: Date = new Date();
  dailyIcon: string = '';
  loading: HTMLIonLoadingElement | undefined;

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService) {
  }
  get getTheme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    this.user = this.authentificationService.user;
    forkJoin([this.settingService.getSettings(),
    this.reviewService.getAllReviews(),
    this.lessonService.searchLessons()]).subscribe(([settings, reviews, lessons]) => {
      reviews.sort((a, b) => a.category < b.category ? -1 : 1).sort((a, b) => a.lesson - b.lesson).sort((a, b) => a.order - b.order).every(r => {
        if (this.user?.review && this.user?.review.category === r.category && this.user?.review.lesson === r.lesson && this.user?.review.order === r.order) {
          this.previousReviews.push(r);
          return;
        }
        this.previousReviews.push(r);
      });
      this.reviewService.findNextReview(this.authentificationService.user.review).then(review => {
        this.review = review;
      });
      this.recommendedLesson = this.lessonService.getRecommendedLesson(this.user && this.user.level ? this.user.level.code : '0', lessons);
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

  accessToLesson() {
    this.router.navigate(['/questions']);
  }


  getDailyIcon(infoDay: any) {
    if (infoDay) {
      const todayMinusOneWeek = new Date();
      todayMinusOneWeek.setDate(todayMinusOneWeek.getDate() - 7 );
      if (infoDay.timestamp.toDate().getTime() > todayMinusOneWeek.getTime()) {
        return "checkbox-outline";
      }
    }
    return "square-outline";
  }

}
