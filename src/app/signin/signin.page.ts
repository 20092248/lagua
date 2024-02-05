import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { forkJoin } from 'rxjs';
import { ReviewService } from '../services/review.service';
import { LessonService } from '../services/lesson.service';
import { Platform } from '@ionic/angular';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SignInPage implements OnInit {

  displayName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  heightLogo: number = 100;
  heightContent: number | undefined;
  isCapacitor: boolean | undefined;

  constructor(private authentificationService: AuthentificationService, private router: Router, private settingService: SettingService,
    private reviewService: ReviewService, private lessonService: LessonService, private platform: Platform) { }

  get isOverlay() {
    return this.settingService.isOverlay;
  }

  ngOnInit() {
    this.isCapacitor = this.settingService.isCapacitor;
    this.heightContent = this.platform.height() - this.heightLogo - 70;
  }

  async signIn() {
    try {
      forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(([firstReview, firstLesson]) => {
        this.authentificationService.createUser(this.displayName, this.email, this.password, firstReview, firstLesson).then((connected: boolean) => {
          if (connected) {
            this.router.navigate(['']); //go to home page
          }
        });
      });
    } catch (error) {
      console.error('Error --> ', error);
    }
  }

  signInWithGoogle() {
    forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(([firstReview, firstLesson]) => {
      this.authentificationService.signInWithGoogle(firstReview, firstLesson).then((connected: boolean) => {
        if (connected) {
          this.router.navigate(['']); //go to home page
        }
      });
    });
  }

  signInWithFacebook() {
    forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(([firstReview, firstLesson]) => {
      this.authentificationService.signinWithFacebook(firstReview, firstLesson).then((connected: boolean) => {
        if (connected) {
          this.router.navigate(['']); //go to home page
        }
      });
    });
  }

}