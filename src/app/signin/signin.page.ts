import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { forkJoin } from 'rxjs';
import { ReviewService } from '../services/review.service';
import { LessonService } from '../services/lesson.service';
import { Platform } from '@ionic/angular';

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

  constructor(private authentificationService: AuthentificationService, private router: Router, 
    private reviewService: ReviewService, private lessonService: LessonService, private platform: Platform) { }

  ngOnInit() {
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
    if (this.platform.is('capacitor')) {

    } else {
      forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(([firstReview, firstLesson]) => {
        this.authentificationService.signinwithgoogle(firstReview, firstLesson).then((connected: boolean) => {
          if (connected) {
            this.router.navigate(['']); //go to home page
          }
        });
      });
    }
  }

  signInWithFacebook() {
    if (this.platform.is('capacitor')) {

    } else {
      forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(([firstReview, firstLesson]) => {
        this.authentificationService.signinwithfacebook(firstReview, firstLesson).then((connected: boolean) => {
          if (connected) {
            this.router.navigate(['']); //go to home page
          }
        });
      });
    }
  }

}