import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, signInWithCredential, signOut, UserCredential, getRedirectResult } from '@angular/fire/auth';
import { doc, getDoc, updateDoc, Firestore, getFirestore, onSnapshot, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { CodeLabel } from '../model/codeLabel.model';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { User } from '../model/user.model';
import { ReviewService } from './review.service';
import { LessonService } from './lesson.service';
import { Review } from '../model/review.model';
import { Lesson } from '../model/lessons.model';
import { ResultReview } from '../model/resultReview.model';
import { finalize, take, interval, Subscription, lastValueFrom } from 'rxjs';
import { LoadingService } from './loading.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender',];
const USER_KEY = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {} as User;
  timer: Date = new Date();
  choice: Subscription | undefined;

  constructor(private _auth: Auth, private _firestore: Firestore, private platform: Platform, private http: HttpClient,
    private reviewService: ReviewService, private lessonService: LessonService, private loadingService: LoadingService,
    private alertService: AlertService) { }

  async isConnected() {
    const customInterval = interval(200).pipe(
      take(5), //take only the first 5 values interval 200ms (1 secondes)
      finalize(() => this.checkUser()) // Execute when the observable completes or unsubscribe
    );
    const finalNumber = await lastValueFrom(customInterval);
    return this.user ? this.user.uid : ''; //'pbgYnF7NvXRWvZdBNDYfNzzITdw1'
  }

  checkUser() {
    if (getAuth()) {
      const user = getAuth().currentUser;
      if (user) {
        this.user.uid = user.uid;
        this.user.email = user.email;
        this.user.displayName = user.displayName;
        this.user.photoURL = user.photoURL;
        this.choice?.unsubscribe();
        this.choice = undefined; // Clear the timeoutId
      }
    }
  }

  async getInfoUser(uid: string) {
    try {
      localStorage.setItem(USER_KEY, uid);
      const document = await getDoc(doc(getFirestore(), 'users', uid));
      this.updateDayConnected('users', uid);
      if (document.exists()) {
        const data = document.data() as User;
        this.user.uid = data.uid;
        this.user.email = data.email;
        this.user.displayName = data.displayName;
        this.user.age = data.age;
        this.user.dialectSelected = data.dialectSelected;
        this.user.photoURL = data.photoURL;
        this.user.learn = data.learn as CodeTextTranslate;
        this.user.why = data.why as CodeLabel;
        this.user.time = data.time as CodeLabel;
        this.user.level = data.level as CodeLabel;
        this.user.review = data.review as Review;
        this.user.lesson = data.lesson as Lesson;
        this.user.resultReviews = data.resultReviews as ResultReview[];
        this.user.resultLessons = data.resultLessons;
        this.user.week = data.week;
        this.user.timerActiveConnection = data.timerActiveConnection;
        return true;
      } else {
        this.logout(false);
        this.alertService.presentToastWithIcon(CONSTANTS.NOT_SIGNIN, 2000, 'danger', 'alert-circle-outline');
        throw Error(CONSTANTS.NOT_SIGNIN);
      }
    } catch (error: any) {
      localStorage.removeItem(USER_KEY);
      throw Error(error);
    }
  }

  async addInfoUser(uid: string, firstReview: Review, firstLesson: Lesson) {
    await setDoc(doc(getFirestore(), 'users', uid), {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      dialectSelected: this.user.dialectSelected,
      photoURL: this.user.photoURL ? this.user.photoURL : '',
      age: this.user.age,
      learn: this.user.learn,
      why: this.user.why,
      time: this.user.time,
      level: this.user.level,
      review: firstReview,
      lesson: firstLesson,
      resultLessons: [],
      resultReviews: [],
      timerActiveConnection: 0
    }, { merge: true });
    this.getInfoUser(uid);
    return true;
  }

  async login(email: string, password: string) {
    let response = await signInWithEmailAndPassword(getAuth(), email, password).then(async (userCredential) => {
      const user = userCredential.user;
      const responseInfoUser = await this.getInfoUser(user?.uid);
      return responseInfoUser;
    }).catch((error) => {
      console.error(error.code + ' : ' + error.message);
      return false;
    });
    return response;
  }

  async createUser(name: string, email: string, password: string, firstReview: Review, firstLesson: Lesson) {
    let responseInfoUser = false;
    let response = await createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        this.user.displayName = name;
        this.user.email = userCredential?.user?.email;
        this.user.uid = userCredential?.user?.uid;
        setDoc(doc(getFirestore(), 'users', this.user.uid), this.user);
        return true;
      })
      .catch((error) => {
        console.error(error.code + ' : ' + error.message);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async loginWithGoogle() {
    if (this.platform.is('capacitor')) {
      return this.loginwithgoogleCapacitor();
    } else {
      return this.loginWithGoogleFirebase();
    }
  }

  async loginwithgoogleCapacitor() {
    try {
      const user = await GoogleAuth.signIn();
      if (user) {
        // Sign in with credential from the Google user.
        let response = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken))
          .then(async (result) => {
            GoogleAuthProvider.credentialFromResult(result);
            this.user = this.getUserCredential(result);
            const responseInfoUser = await this.getInfoUser(result.user?.uid);
            return responseInfoUser;
          })
          .catch((error) => {
            GoogleAuthProvider.credentialFromError(error);
            throw Error(error.message);
          });
        return response;
      } else {
        return false;
      }
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async loginWithGoogleFirebase(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const auth = getAuth();
      let response = await signInWithPopup(auth, provider)
        .then(async (result) => {
          GoogleAuthProvider.credentialFromResult(result);
          this.user = this.getUserCredential(result);
          const responseInfoUser = await this.getInfoUser(result.user?.uid);
          return responseInfoUser;
        }).catch((error) => {
          GoogleAuthProvider.credentialFromError(error);
          throw Error(error.message);
        });
      return response;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async signInWithGoogle(firstReview: Review, firstLesson: Lesson) {
    if (this.platform.is('capacitor')) {
      return this.signinWithGoogleCapacitor(firstReview, firstLesson);
    } else {
      return this.signinWithGoogleFirebase(firstReview, firstLesson);
    }
  }

  async signinWithGoogleCapacitor(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then(async (result) => {
        GoogleAuthProvider.credentialFromResult(result);
        this.user = this.getUserCredential(result);
        return true;
      }).catch((error) => {
        GoogleAuthProvider.credentialFromError(error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async signinWithGoogleFirebase(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then(async (result) => {
        GoogleAuthProvider.credentialFromResult(result);
        this.user = this.getUserCredential(result);
        return true;
      }).catch((error) => {
        GoogleAuthProvider.credentialFromError(error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async loginWithFacebook() {
    if (this.platform.is('capacitor')) {
      return this.loginWithFacebookCapacitor();
    } else {
      return this.loginWithFacebookFirebase();
    }
  }

  async loginWithFacebookCapacitor(): Promise<boolean> {
    const result = await (FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })) as FacebookLoginResponse;
    if (result.accessToken && result.accessToken.token) {
      let response = await signInWithCredential(getAuth(), FacebookAuthProvider.credential(result.accessToken.token))
        .then(async (result) => {
            this.user = this.getUserCredential(result);
            const responseInfoUser = await this.getInfoUser(result.user?.uid);
            return responseInfoUser;
        })
        .catch((error) => {
          FacebookAuthProvider.credentialFromError(error);
          throw Error(error.message);
        });
        return response;
    } else {
      console.error('Impossible de récupérer l\'utilisateur Facebook');
      return false;
    }
  }

  async loginWithFacebookFirebase(): Promise<boolean> {
    try {
      const provider = new FacebookAuthProvider();
      provider.setDefaultLanguage('fr');
      provider.addScope('user_birthday');
      const auth = getAuth();
      let response = await signInWithPopup(auth, provider)
        .then(async (result) => {
          if (result) {
            this.user = this.getUserCredential(result);
            FacebookAuthProvider.credentialFromResult(result);
            const responseInfoUser = await this.getInfoUser(result.user?.uid);
            return responseInfoUser;
          } else {
            return false;
          }
        })
        .catch((error) => {
          FacebookAuthProvider.credentialFromError(error);
          throw Error(error.message);
        });
      return response;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async signinWithFacebook(firstReview: Review, firstLesson: Lesson) {
    if (this.platform.is('capacitor')) {
      return this.signinWithFacebookCapacitor(firstReview, firstLesson);
    } else {
      return this.signinWithFacebookFirebase(firstReview, firstLesson);
    }
  }

  async signinWithFacebookCapacitor(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        this.user = this.getUserCredential(result);
        FacebookAuthProvider.credentialFromResult(result);
        return true;
      })
      .catch((error) => {
        FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async signinWithFacebookFirebase(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        FacebookAuthProvider.credentialFromResult(result);
        const userData = this.getUserCredential(result);
        FacebookAuthProvider.credentialFromResult(result);
        return true;
      })
      .catch((error) => {
        FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async logout(disconnect: boolean) {
    if (disconnect && getAuth().currentUser) {
      this.updateDayDisconnected('users', this.user.uid ? this.user.uid : '');
    }
    return signOut(getAuth()).then(() => {
      this.user = {} as User;
      localStorage.removeItem(USER_KEY);
      console.log('sign-out successful.');
    }).catch((error) => {
      console.error(error);
    });
  }

  async updateResultReview(updateReview: any, nameObject: string, uid: string) {
    if (!this.user.resultReviews) {
      this.user.resultReviews = [];
    }
    this.user.resultReviews.push(updateReview);
    const userRef = doc(getFirestore(), nameObject, uid);
    const nextReview = await this.reviewService.findNextReview(this.user.review).then(result => { return result });
    this.reviewService.getPreviousReviews(nextReview).then(() => { });
    await updateDoc(userRef, {
      review: nextReview,
      resultReviews: this.user.resultReviews.map((obj) => { return Object.assign({}, obj) })
    });
  }

  async updateLesson(updateLesson: Lesson, nameObject: string, uid: string) {
    const lessonsRef = doc(getFirestore(), nameObject, uid);
    const userLessonExist = this.user.resultLessons?.find(lesson => lesson.code === updateLesson.code);
    if (this.user.lesson && !userLessonExist) {
      const lesson = await this.lessonService.findNextLesson(this.user.lesson);
      this.user.lesson = lesson;
      if (!this.user.resultLessons) {
        this.user.resultLessons = [];
      }
      this.user.resultLessons.push(updateLesson);
      await updateDoc(lessonsRef, {
        lesson: lesson,
        resultLessons: this.user.resultLessons.map((obj) => { return Object.assign({}, obj) })
      });
    }
  }

  async updateDayConnected(collection: string, uid: string) {
    try {
      this.timer = new Date();
      const userRef = doc(getFirestore(), collection, uid);
      var data = {};
      const today = new Date();
      if (today.getUTCDay() === 0) {
        data = { 'week.dim': { day: 7, timestamp: today } }
      } else if (today.getUTCDay() === 1) {
        data = { 'week.lun': { day: today.getUTCDay(), timestamp: today } }
      } else if (today.getUTCDay() === 2) {
        data = { 'week.mar': { day: today.getUTCDay(), timestamp: today } }
      } else if (today.getUTCDay() === 3) {
        data = { 'week.mer': { day: today.getUTCDay(), timestamp: today } }
      } else if (today.getUTCDay() === 4) {
        data = { 'week.jeu': { day: today.getUTCDay(), timestamp: today } }
      } else if (today.getUTCDay() === 5) {
        data = { 'week.ven': { day: today.getUTCDay(), timestamp: today } }
      } else if (today.getUTCDay() === 6) {
        data = { 'week.sam': { day: today.getUTCDay(), timestamp: today } }
      }
      await updateDoc(userRef, data);
    } catch (error) {
      throw Error(CONSTANTS.UPDATE_DAY_CONNECTED_KO);
    }
  }

  async updateDayDisconnected(nameObject: string, uid: string) {
    const userRef = doc(getFirestore(), nameObject, uid);
    const dateDisconnected = new Date();
    if (this.user?.timerActiveConnection != undefined && this.user?.timerActiveConnection != null) {
      await updateDoc(userRef, {
        timerActiveConnection: this.user?.timerActiveConnection + (dateDisconnected.getTime() - this.timer.getTime())
      });
    }
  }

  getUserCredential(result: UserCredential) {
    this.user.uid = result.user.uid;
    this.user.email = result.user.email;
    this.user.displayName = result.user.displayName;
    this.user.photoURL = result.user.photoURL;
    return this.user;
  }

  getFacebookUserCredential(result: any) {
    this.user.uid = result.id;
    this.user.email = result.email;
    this.user.displayName = result.name;
    this.user.photoURL = result.picture && result.picture.data ? result.picture.data.url : '';
    return this.user;
  }

}