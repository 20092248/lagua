import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithCredential, signOut, UserCredential, sendPasswordResetEmail } from '@angular/fire/auth';
import { doc, getDoc, updateDoc, Firestore, getFirestore, setDoc, Timestamp } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import { ReviewService } from './review.service';
import { LessonService } from './lesson.service';
import { Review } from '../model/review.model';
import { Lesson } from '../model/lesson.model';
import { ResultReview } from '../model/resultReview.model';
import { finalize, take, interval, Subscription, lastValueFrom } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FacebookLogin, FacebookLoginResponse } from '@capacitor-community/facebook-login';
import { HttpClient } from '@angular/common/http';
import { CONSTANTS } from '../utils/constants';
import { AlertService } from './alert.service';
import { Utils } from '../utils/utils';
import { DialectEnum } from '../model/dialect.enum';
import { AnalyticsService } from './analytics.service';
import { LessonMin } from '../model/lessonMin.model';
import { SettingService } from './setting.service';
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender',];
const USER_KEY = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {} as User;
  timer: Date = new Date();
  choice: Subscription | undefined;
  dialect: DialectEnum = DialectEnum.SHGC;

  constructor(private _auth: Auth, private _firestore: Firestore, private http: HttpClient,
    private reviewService: ReviewService, private lessonService: LessonService, private settingService: SettingService,
    private alertService: AlertService, private analyticsService: AnalyticsService) { }

  async isConnected() {
    const customInterval = interval(200).pipe(
      take(5), //take only the first 5 values interval 200ms (1 secondes)
      finalize(() => this.checkUser()) // Execute when the observable completes or unsubscribe
    );
    await lastValueFrom(customInterval);
    return this.user ? this.user.uid : ''; //'pbgYnF7NvXRWvZdBNDYfNzzITdw1'
  }

  checkUser() {
    if (getAuth()) {
      const user = getAuth().currentUser;
      if (user) {
        this.analyticsService.setUserId(this.user.uid);
        this.analyticsService.logEvent('check_user', { content_type: 'user', method: 'check_user', transaction_id: this.user.uid });
        this.user.uid = user.uid;
        this.user.email = Utils.valueNotNull(user.email);
        this.user.displayName = Utils.valueNotNull(user.displayName);
        this.user.photoURL = Utils.valueNotNull(user.photoURL);
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
        this.user.photoURL = data.photoURL;
        this.user.dialects = data.dialects;
        this.user.dialectSelected = data.dialectSelected;
        this.user.week = data.week;
        this.user.timerActiveConnection = data.timerActiveConnection;
        this.user.account = data.account;
        this.dialect = Utils.findDialect(this.user.dialectSelected.code);
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
    this.addFirstReviewAndFirstLessonInDialect(firstReview, firstLesson);
    await setDoc(doc(getFirestore(), 'users', uid), {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      photoURL: this.user.photoURL ? this.user.photoURL : '',
      dialectSelected: this.user.dialectSelected,
      dialects: this.user.dialects,
      account: this.user.account,
      timerActiveConnection: 0
    }, { merge: true });
    this.getInfoUser(uid);
    return true;
  }

  async addDialect(uid: string) {
    const dialectsInfo = this.infoAddDialect();
    if (dialectsInfo) {
      await updateDoc(doc(getFirestore(), 'users', uid), dialectsInfo);
    } else {
      this.alertService.presentToast(CONSTANTS.UPDATE_DIALECT_KO, 3000, 'danger');
    }
    this.getInfoUser(uid);
    return true;
  }

  async addDialectWithoutDialects(uid: string) {
    const dialectsInfo = this.infoAddDialect();
    if (dialectsInfo) {
      await updateDoc(doc(getFirestore(), 'users', uid), { 'dialectSelected': this.user.dialectSelected });
    } else {
      this.alertService.presentToast(CONSTANTS.UPDATE_DIALECT_KO, 3000, 'danger');
    }
    this.getInfoUser(uid);
    return true;
  }

  infoAddDialect() {
    var dialect = null;
    if (this.dialect === DialectEnum.SHGC) {
      dialect = { 'dialectSelected': this.user.dialectSelected, 'dialects.shingazidja': this.user.dialects[this.dialect] };
    } else if (this.dialect === DialectEnum.SHAN) {
      dialect = { 'dialectSelected': this.user.dialectSelected, 'dialects.shindzuani': this.user.dialects[this.dialect] };
    } else if (this.dialect === DialectEnum.MOHE) {
      dialect = { 'dialectSelected': this.user.dialectSelected, 'dialects.shimwali': this.user.dialects[this.dialect] };
    } else if (this.dialect === DialectEnum.MAOR) {
      dialect = { 'dialectSelected': this.user.dialectSelected, 'dialects.shimaore': this.user.dialects[this.dialect] };
    }
    return dialect;
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
      .then((userCredential: UserCredential) => {
        this.analyticsService.setUserId(userCredential.user.uid);
        this.analyticsService.logEvent('login', { content_type: 'user', screen_name: 'login', method: 'user_password', transaction_id: userCredential.user.uid });
        this.user.displayName = name;
        this.user.email = Utils.valueNotNull(userCredential.user.email);
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
    if (this.settingService.isCapacitor) {
      return this.loginwithgoogleCapacitor();
    } else {
      return this.loginWithGoogleFirebase();
    }
  }

  async loginwithgoogleCapacitor() {
    try {
      const user = await GoogleAuth.signIn();
      console.log('user', user);
      if (user) {
        // Sign in with credential from the Google user.
        let response = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken))
          .then(async (result) => {
            this.analyticsService.setUserId(result.user.uid);
            this.analyticsService.logEvent('login', { content_type: 'user', screen_name: 'login', method: 'capacitor_google', transaction_id: result.user.uid });
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
          this.analyticsService.setUserId(result.user.uid);
          this.analyticsService.logEvent('login', { content_type: 'user', screen_name: 'login', method: 'firebase_google', transaction_id: result.user.uid });
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
    if (this.settingService.isCapacitor) {
      return this.signinWithGoogleCapacitor(firstReview, firstLesson);
    } else {
      return this.signinWithGoogleFirebase(firstReview, firstLesson);
    }
  }

  async signinWithGoogleCapacitor(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    let responseInfoUser = false;
    const user = await GoogleAuth.signIn();
    if (user) {
      // Sign in with credential from the Google user.
      let response = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken))
        .then(async (result) => {
          this.analyticsService.setUserId(result.user.uid);
          this.analyticsService.logEvent('sign_up', { content_type: 'user', screen_name: 'sign_up', method: 'capacitor_google', transaction_id: result.user.uid });
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
    } else {
      return false;
    }
  }

  async signinWithGoogleFirebase(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then(async (result) => {
        this.analyticsService.setUserId(result.user.uid);
        this.analyticsService.logEvent('sign_up', { content_type: 'user', screen_name: 'sign_up', method: 'firebase_google', transaction_id: result.user.uid });
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
    if (this.settingService.isCapacitor) {
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
          this.analyticsService.setUserId(result.user.uid);
          this.analyticsService.logEvent('login', { content_type: 'user', screen_name: 'login', method: 'capacitor_facebook', transaction_id: result.user.uid });
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
            this.analyticsService.setUserId(result.user.uid);
            this.analyticsService.logEvent('login', { content_type: 'user', screen_name: 'login', method: 'firebase_facebook', transaction_id: result.user.uid });
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
    if (this.settingService.isCapacitor) {
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
        this.analyticsService.setUserId(result.user.uid);
        this.analyticsService.logEvent('sign_up', { content_type: 'user', screen_name: 'sign_up', method: 'capacitor_facebook', transaction_id: result.user.uid });
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
        this.analyticsService.setUserId(result.user.uid);
        this.analyticsService.logEvent('sign_up', { content_type: 'user', screen_name: 'sign_up', method: 'firebase_facebook', transaction_id: result.user.uid });
        FacebookAuthProvider.credentialFromResult(result);
        this.getUserCredential(result);
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
      this.updateDayDisconnected('users', Utils.valueNotNull(this.user.uid));
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
    const dialectUser = this.user.dialects[this.dialect];
    if (!dialectUser.resultReviews) { dialectUser.resultReviews = []; }
    dialectUser.resultReviews.push(updateReview);
    const userRef = doc(getFirestore(), nameObject, uid);
    const nextReview = await this.reviewService.findNextReview(dialectUser.review).then(result => { return result });
    dialectUser.review = nextReview;
    this.reviewService.getPreviousReviews(nextReview).then(() => { });
    const updateReviewDoc = this.infoReviewByDialect(nextReview, dialectUser.resultReviews);
    if (updateReviewDoc) {
      await updateDoc(userRef, updateReviewDoc);
    }
  }

  async updateLesson(updateLesson: Lesson, nameObject: string, uid: string) {
    const dialectUser = this.user.dialects[this.dialect];
    const lessonsRef = doc(getFirestore(), nameObject, uid);
    if (!dialectUser.resultLessons) { dialectUser.resultLessons = []; }
    const userLessonExist = dialectUser.resultLessons.find(lesson => lesson.code === updateLesson.code);
    if (dialectUser.lesson && !userLessonExist) {
      const nextLesson = await this.lessonService.findNextLesson(dialectUser.lesson);
      dialectUser.lesson = nextLesson;
      dialectUser.resultLessons.push(updateLesson);
      const updateLessonDoc = this.infoLessonByDialect(nextLesson, dialectUser.resultLessons);
      if (updateLessonDoc) {
        await updateDoc(lessonsRef, updateLessonDoc);
      }
    }
  }

  async addPremiumAccount() {
    this.user.account.startDate = Timestamp.now();
    this.user.account.endDate = this.addMonth(this.user.account.startDate, this.user.account.month);
    const userRef = doc(getFirestore(), 'users', this.user.uid);
    await updateDoc(userRef, {
      account: {
        premium: true,
        month: this.user.account.month,
        originalPrice: this.user.account.originalPrice,
        price: this.user.account.price,
        startDate: this.user.account.startDate,
        endDate: this.user.account.endDate,
        percentageReduction: this.user.account.percentageReduction,
        type: this.user.account.type
      }
    });
    return true;
  }

  infoReviewByDialect(nextReview: Review, resultReviews: ResultReview[]) {
    var dialect = null;
    if (this.dialect === DialectEnum.SHGC) {
      dialect = { 'dialects.shingazidja.review': nextReview, 'dialects.shingazidja.resultReviews': resultReviews.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.SHAN) {
      dialect = { 'dialects.shindzuani.review': nextReview, 'dialects.shindzuani.resultReviews': resultReviews.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.MOHE) {
      dialect = { 'dialects.shimwali.review': nextReview, 'dialects.shimwali.resultReviews': resultReviews.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.MAOR) {
      dialect = { 'dialects.shimaore.review': nextReview, 'dialects.shimaore.resultReviews': resultReviews.map((obj) => { return Object.assign({}, obj) }) };
    }
    return dialect;
  }

  infoLessonByDialect(nextLesson: LessonMin, resultLessons: LessonMin[]) {
    var dialect = null;
    if (this.dialect === DialectEnum.SHGC) {
      dialect = { 'dialects.shingazidja.lesson': nextLesson, 'dialects.shingazidja.resultLessons': resultLessons.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.SHAN) {
      dialect = { 'dialects.shindzuani.lesson': nextLesson, 'dialects.shindzuani.resultLessons': resultLessons.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.MOHE) {
      dialect = { 'dialects.shimwali.lesson': nextLesson, 'dialects.shimwali.resultLessons': resultLessons.map((obj) => { return Object.assign({}, obj) }) };
    } else if (this.dialect === DialectEnum.MAOR) {
      dialect = { 'dialects.shimaore.lesson': nextLesson, 'dialects.shimaore.resultLessons': resultLessons.map((obj) => { return Object.assign({}, obj) }) };
    }
    return dialect;
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

  async sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getUserCredential(result: UserCredential) {
    this.user.uid = result.user.uid;
    this.user.email = Utils.valueNotNull(result.user.email);
    this.user.displayName = Utils.valueNotNull(result.user.displayName);
    this.user.photoURL = Utils.valueNotNull(result.user.photoURL);
    return this.user;
  }

  getFacebookUserCredential(result: any) {
    this.user.uid = result.id;
    this.user.email = result.email;
    this.user.displayName = result.name;
    this.user.photoURL = result.picture && result.picture.data ? result.picture.data.url : '';
    return this.user;
  }

  addFirstReviewAndFirstLessonInDialect(firstReview: Review, firstLesson: Lesson) {
    const dialect = Utils.findDialect(this.user.dialectSelected.code);
    this.user.dialects[dialect].review = firstReview;
    this.user.dialects[dialect].lesson = firstLesson;
  }

  addMonth(date: Timestamp, month: number) {
    return Timestamp.fromDate(new Date(new Date(date.toDate().setMonth(date.toDate().getMonth() + month)).setDate(date.toDate().getDate() -1)));
  }

  getPremium() {
    const account = this.user.account;
    if(account) {
      return account.premium && account.endDate?.toDate() > new Date();
    } else {
      return false;
    }
  }

}