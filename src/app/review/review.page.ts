import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Review } from '../model/review.model';
import { ReviewService } from '../services/review.service';
import { SettingService } from '../services/setting.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { User } from '../model/user.model';
import { IonContent, ScrollDetail, ToastController } from '@ionic/angular';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { QuestionService } from '../services/question.service';
import { ReviewGroup } from '../model/reviewGroup.model';
import { LoadingService } from '../services/loading.service';
import { Utils } from '../utils/utils';
import { CONSTANTS } from '../utils/constants';
import { AudioService } from '../services/audio.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  categorySelected: any;
  codeCategorySelectedLevel: number = 0;
  categories: any[] = [];
  reviews: ReviewGroup[] = [];
  userReview: Review = {} as Review;
  userLearn: CodeTextTranslate = {} as CodeTextTranslate;
  category: string = 'A1';
  categoryLevel: number = 0;
  isPinned: boolean = false;
  isWordsDisplay: boolean = false;
  translate: string = 'francais';
  words: any[] = [];
  displayAccordion: string = '';
  flagSrc: string = '';

  constructor(private router: Router, private settingsService: SettingService, private reviewService: ReviewService, private authentificationService: AuthentificationService,
    private toastController: ToastController, private questionService: QuestionService, private settingService: SettingService, private loadingService: LoadingService,
    private audioService: AudioService) { }

  get user() {
    return this.authentificationService.user;
  }
  get dialect() {
    return this.authentificationService.dialect;
  }
  get userDialect() {
    return this.user.dialects[this.dialect];
  }
  get isOverlay() {
    return this.settingsService.isOverlay;
  }

  ngOnInit() {
    Utils.customCapacitorTabs(this.settingService);
    this.userLearn = this.userDialect.learn;
    this.userReview = this.userDialect.review;
    this.displayAccordion = this.userReview.category + '_' + this.userReview.lesson;
    if (!this.categories.length) {
      this.settingsService.getSetting('reviews').then((data => {
        this.categories = data.categories;
        this.categorySelected = data.categories[0];
        this.flagSrc = data.flag;
      }));
    }
    if (this.userReview.category) {
      this.category = this.userReview.category;
      this.categoryLevel = this.reviewService.getCategoryLevel(this.category);
      this.codeCategorySelectedLevel = this.reviewService.getCategoryLevel(this.category);
    }
    this.loadingService.present('Chargement...');
    this.reviewService.getReviewsByCategory(this.category).then((results: ReviewGroup[]) => {
      this.loadingService.dismiss();
      this.reviews = results;
      // this.settingService.createDocument('reviews', '0xABG8UXaN8qNIXO8Ri0', data[0]).then();
    });
  }

  ionViewWillEnter() {
    this.userLearn = this.userDialect.learn;
    this.userReview = this.userDialect.review;
  }

  setCategory(code: string) {
    this.reviews = [];
    this.codeCategorySelectedLevel = this.reviewService.getCategoryLevel(code);
    this.categorySelected = this.categories.find(c => c.code === code);
    this.reviewService.getReviewsByCategory(code).then((results: ReviewGroup[]) => {
      this.reviews = results;
    });
  }

  goTo(routing: string) {
    if (this.user.email = 'lagua.shikomori@gmail.com') {
      this.router.navigate([routing + '/' + this.category]);
    }
  }

  accessReview(review: Review) {
    this.reviewService.review = review;
    if(this.categoryLevel === this.codeCategorySelectedLevel && this.userReview.lesson === review.lesson && this.userReview.order === review.order){
      this.startReview(review);
    } else {
      this.router.navigate(['/questions']);
    }
  }

  startReview(review: Review) {
    this.questionService.getQuestions(CONSTANTS.transcodeCollectionQuestions[this.user.dialectSelected.code], review.category + '_' + review.lesson + '_' + review.order).then(()=>{
      this.router.navigate(['/questions/preview']);
      this.getInfoReview();
    });
  }
  getInfoReview() {
    this.reviewService.resultReview.category = this.reviewService.review.category;
    this.reviewService.resultReview.lesson = this.reviewService.review.lesson;
    this.reviewService.resultReview.order = this.reviewService.review.order;
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

  openModal(review: Review) {
    this.isWordsDisplay = true;
    this.words = [];
    this.questionService.getQuestions(this.userLearn?.text.toLocaleLowerCase() + '_' + this.translate + '_questions', review.category + '_' + review.lesson + '_' + review.order).then(result => {
      this.words = result.qcm.questions;
    });
  }

  closeModal() {
    this.isWordsDisplay = false;
  }

  goToModifyReview(category: string, lesson: number, order: number) {
    this.router.navigate(['/tabs/review/modify-review/' + category + '/' + lesson + '/' + order]);
  }
}
