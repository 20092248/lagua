import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Review } from '../model/review.model';
import { ReviewService } from '../services/review.service';
import { SettingService } from '../services/setting.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../model/user.model';
import { IonContent, ScrollDetail, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  categorySelected: any;
  codeCategorySelectedLevel: number = 0;
  categories: any[] = [];
  reviews: Review[] = [];
  userReview: Review = {} as Review;
  category: string = 'A1';
  categoryLevel: number = 0;
  isPinned: boolean = false;

  constructor(private router: Router, private settingsService: SettingService, private reviewService: ReviewService, private authentificationService: AuthentificationService, private toastController: ToastController) { }

  ngOnInit() {
    this.userReview = this.authentificationService.user?.review;
    if (!this.categories.length) {
      this.settingsService.getSetting('reviews').then((data => {
        this.categories = data.categories;
        this.categorySelected = data.categories[0];
      }));
    }
    if (this.userReview?.category) {
      this.category = this.userReview.category;
      this.categoryLevel = this.reviewService.getCategoryLevel(this.category);
      this.codeCategorySelectedLevel = this.reviewService.getCategoryLevel(this.category);
    }
    this.reviewService.getReviewsByCategory(this.category).then((data: Review[]) => {
      this.reviews = data;
    });
  }

  setCategory(code: string) {
    this.reviews = [];
    this.codeCategorySelectedLevel = this.reviewService.getCategoryLevel(code);
    this.categorySelected = this.categories.find(c => c.code === code);
    this.reviewService.getReviewsByCategory(code).then((data: Review[]) => {
      this.reviews = data;
    });
  }

  accessReview(review: Review) {
    this.reviewService.review = review;
    this.router.navigate(['/questions']);
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    this.isPinned = ev.detail.scrollTop > 125;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Impossible de sélectionner ce cours sans avoir lu les précedents cours.',
      duration: 1500,
      position: 'bottom',
    });
    await toast.present();
  }
  // this.settingsService.createDocument('settings','reviews', data);
  // this.settingsService.createCollection('reviews', data);

}
