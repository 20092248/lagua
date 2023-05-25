import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Lessons } from '../model/lessons.model';
import { User } from '../model/user.model';
import { AuthentificationService } from '../services/authentification.service';
import { LessonsService } from '../services/lessons.service';
import { ThemeService } from '../services/theme.service';
import { ModalController } from '@ionic/angular';
import { ReviewService } from '../services/review.service';
import { Review } from '../model/review.model';

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
  currentDate: Date = new Date();
  dailyIcon: string | undefined;

  constructor(private router: Router, private themeService: ThemeService, private authentificationService: AuthentificationService, private lessonsService: LessonsService, private popoverController: PopoverController, private modalController: ModalController, private reviewService: ReviewService) {
  }
  get getTheme() {
    return this.themeService.themeMode;
  }

  ngOnInit() {
    this.user = this.authentificationService.user;
    if (this.lessonsService.lessons && this.lessonsService.lessons.length) {
      this.getRecommendedLesson(this.lessonsService.lessons);
    } else {
      this.lessonsService.searchLessons().then(((lessons: Lessons[]) => {
        this.getRecommendedLesson(lessons);
      }));
    }
  }

  logout() {
    this.authentificationService.logout().then(() => {
      this.goTo('/firstpage', true);
    });
  }

  goTo(routing: string, dissmissPopover: boolean) {
    this.router.navigate([routing]);
    if(dissmissPopover) {
      this.dismissPopover();
    }
  }

  getRecommendedLesson(lessons: Lessons[]) {
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
    this.reviewService.getReview('A1').then((data: Review[]) =>{
      this.reviews = data;
    });
  }

  accessToNextLesson() {
    this.router.navigate(['/questions']);
  }

  getDailyIcon(day: number) {
    const currentDay = this.currentDate.getUTCDay();
    if(currentDay >= day){
      return "checkbox-outline";
    } else {
      return "square-outline";
    }
  }

}
