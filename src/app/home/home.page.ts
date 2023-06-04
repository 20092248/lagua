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
    slidesPerView: 1.75,
    speed: 400,
  };
  recommendedLesson: any[] = [];
  reviews: Review[] = [];
  review: Review | undefined;
  currentDate: Date = new Date();
  dailyIcon: string = '';
  loading: HTMLIonLoadingElement | undefined;
  nextReview: Review = {} as Review;

  constructor(private router: Router, private themeService: ThemeService, private settingService: SettingService, 
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController, 
    private modalController: ModalController, private reviewService: ReviewService, private loadingService: LoadingService) {
  }
  get getTheme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    // this.showLoading();
    this.user = this.authentificationService.user;
    forkJoin([this.settingService.getSettings(),
    this.reviewService.getAllReviews(),
    this.lessonService.searchLessons()]).subscribe(([settings, reviews, lessons]) => {
      this.findNextReview(reviews);
      this.reviewService.nextReview({category: 'A1', lesson: 1} as Review);
    });
    if (this.lessonService.lessons && this.lessonService.lessons.length) {
      this.getRecommendedLesson(this.lessonService.lessons);
    } else {
      this.lessonService.searchLessons().then(((lessons: Lesson[]) => {
        this.getRecommendedLesson(lessons);
      }));
    }
    const category = this.user.review ? this.user.review.category : 'A1';
    const lesson = this.user.review ? this.user.review.category : 1;
    const order = this.user.review ? this.user.review.category : 1;
    this.reviewService.getReview(category, lesson, order).then((value: Review) => {
      this.review = value;
    });
    // this.stopLoading();
  }

  findNextReview(review: Review[]) {
    if (!this.user?.resultReviews) {
      this.reviewService.getReview('A1', 1, 1).then((value: Review) => {
        this.review = value;
      });
    } else {
      const userReview = this.user.review;
      const reviewByCategory = review.filter(r => r.category === userReview.category).sort((a, b) => a.lesson - b.lesson).sort((a, b) => a.order - b.order);
      if (userReview.order === reviewByCategory.length) {
        this.reviewService.getReview(this.nextCategory(this.user.review.category), 1, 1).then((value: Review) => {
          this.review = value;
        });
      } else {
        this.reviewService.getReview(this.nextCategory(this.user.review.category), 1, 1).then((value: Review) => {
          this.review = value;
        });
      }
    }
  }

  nextCategory(category: string) {
    var nextCategory = '';
    switch (category) {
      case 'A1':
        nextCategory = 'A2'
        break;
      case 'A2':
        nextCategory = 'B1'
        break;
      case 'B1':
        nextCategory = 'B2'
        break;
      case 'B2':
        nextCategory = 'C1'
        break;
      default:
        break;
    }
    return category;
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

  getRecommendedLesson(lessons: Lesson[]) {
    if (this.user?.level?.code === '0') { // Découverte
      this.recommendedLesson = lessons.slice(0, 3);
    } else if (this.user?.level?.code === '1') { // Débutant
      this.recommendedLesson = lessons.slice(2, 5);
    } else if (this.user?.level?.code === '2') { // Intermédiaire
      this.recommendedLesson = lessons.slice(3, 6);
    } else if (this.user?.level?.code === '3') { // Intermediaire avancé
      this.recommendedLesson = lessons.slice(4, 7);
    } else if (this.user?.level?.code === '4') { // Avancé
      this.recommendedLesson = lessons.slice(5, 8);
    }
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

  accessToLesson() {
    this.router.navigate(['/questions']);
  }

  getDailyIcon(day: number) {
    const currentDay = this.currentDate.getUTCDay() ? this.currentDate.getUTCDay() : 7; // cas pour dimanche
    if (currentDay >= day) {
      return "checkbox-outline";
    } else {
      return "square-outline";
    }
  }

}
