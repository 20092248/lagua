import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { IonRouterOutlet, IonTabs, Platform, PopoverController } from '@ionic/angular';
import { Lesson } from '../model/lesson.model';
import { AuthentificationService } from '../services/authentification.service';
import { LessonService } from '../services/lesson.service';
import { ThemeService } from '../services/theme.service';
import { ReviewService } from '../services/review.service';
import { Review } from '../model/review.model';
import { SettingService } from '../services/setting.service';
import { LoadingService } from '../services/loading.service';
import { forkJoin } from 'rxjs';
import { register } from 'swiper/element/bundle';
import { Utils } from '../utils/utils';
import { AlertService } from '../services/alert.service';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { CONSTANTS } from '../utils/constants';
import { App } from '@capacitor/app';
import { QuestionService } from '../services/question.service';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import { GlobalParam } from '../model/globalParam.model';
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
  setting: GlobalParam = {} as GlobalParam;
  levelDialog: string = '';
  otherDialects: CodeTextTranslate[] = [];
  dialectLearned: string = '';
  dialectPathLearned: string = '';
  displayPremiumAccountModal: boolean = false;
  animation: AnimationItem = {} as AnimationItem;
  options: AnimationOptions = { path: 'assets/img/medal.json', loop: false, name: 'medal' };
  styles: Partial<CSSStyleDeclaration> = { margin: 'auto', width: '100%', maxWidth: '300px' };
  uploadSetting: EventEmitter<any> = new EventEmitter();
  @ViewChild(IonTabs, { static: true }) private ionTabs: IonTabs = {} as IonTabs;

  constructor(private router: Router, private route: ActivatedRoute, private themeService: ThemeService, private settingService: SettingService, private alertService: AlertService,
    private authentificationService: AuthentificationService, private lessonService: LessonService, private popoverController: PopoverController,
    private reviewService: ReviewService, private loadingService: LoadingService, private platform: Platform, private settingsService: SettingService,
    private questionService: QuestionService, private routerOutlet: IonRouterOutlet) {
      this.route.queryParams.subscribe(() => {
        if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation()?.extras?.state) {
          const data = this.router.getCurrentNavigation()?.extras?.state?.['data'];
          if(data && data.newAccount) {
            //animation compte premium
            this.displayPremiumAccountModal = true;
          }
        }
      });
      this.displayPremiumAccountModal = true;
     }

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
  get isOverlay(){
    return this.settingsService.isOverlay;
  }  

  ngOnInit() {
    Utils.customCapacitorTabs(this.settingService);
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
      this.dialectPathLearned = CONSTANTS.transcodeDialect[this.user.dialectSelected.code];
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

  goToLesson(routing: string, lessonUnlock: boolean, lesson: Lesson) {
    if (lessonUnlock) {
      const navigationExtras: NavigationExtras = {
        state: { data: lesson }
      };
      this.router.navigate([routing], navigationExtras);
    } else {
      this.alertService.presentToast('Débloquer les précedentes leçons avant d\'accéder à la leçon "' + lesson.title + '".', 3000, 'lagua');
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
    this.startReview(this.userDialect.review);
    // this.router.navigate(['/questions']);
  }

  startReview(review: Review) {
    this.questionService.findQuestions(CONSTANTS.transcodeCollectionQuestions[this.user.dialectSelected.code], Utils.paramReview(review.category, review.lesson, review.order)).then(()=>{
      this.router.navigate(['/questions/preview']);
      this.getInfoReview();
    });
  }

  getInfoReview() {
    this.reviewService.resultReview.category = this.reviewService.review.category;
    this.reviewService.resultReview.lesson = this.reviewService.review.lesson;
    this.reviewService.resultReview.order = this.reviewService.review.order;
  }

  animationCreated(animation: any) {
    this.animation = animation as AnimationItem;
  }
  
  complete(event: any) {
    console.log('complete medal');
    // this.animation.destroy('medal');
  }

  closeDisplayPremiumAccountModal() {
    this.displayPremiumAccountModal = false;
  }

  logout() {
    this.authentificationService.logout(true).then(() => {
      this.goTo('/firstpage', true, true);
    });
  }

}
