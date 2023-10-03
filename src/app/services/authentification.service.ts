import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, UserCredential } from '@angular/fire/auth';
import { doc, getDoc, updateDoc, Firestore, getFirestore, onSnapshot, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { CodeLabel } from '../model/codeLabel.model';
import { CodeTextTranslate } from '../model/codeTextTranslate.model';
import { User } from '../model/user.model';
import { ReviewService } from './review.service';
import { forkJoin } from 'rxjs';
import { LessonService } from './lesson.service';
import { Review } from '../model/review.model';
import { Lesson } from '../model/lessons.model';
import { ResultReview } from '../model/resultReview.model';

const USER_KEY = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {} as User;
  timer: Date = new Date();

  constructor(private _auth: Auth, private _firestore: Firestore, private reviewService: ReviewService, private lessonService: LessonService) { }

  checkUserState() {
    return localStorage.getItem(USER_KEY);
  }

  async getInfoUser(uid: string) {
    try {
      localStorage.setItem(USER_KEY, uid);
      await this.updateDayConnected('users', uid);
      const document = await getDoc(doc(getFirestore(), 'users', uid));
      if (document.exists()) {
        const data = document.data() as User;
        this.user.uid = data.uid;
        this.user.email = data.email;
        this.user.displayName = data.displayName;
        this.user.age = data.age;
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
        throw new Error('Utilisateur introuvable');
      }
    } catch (error: any) {
      localStorage.removeItem(USER_KEY);
      throw Error(error.message);
    }
  }

  async addInfoUser(uid: string, firstReview: Review, firstLesson: Lesson) {
    await setDoc(doc(getFirestore(), 'users', uid), {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
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

  async loginwithgoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      let response = await signInWithPopup(auth, provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential ? credential.accessToken : null;
          // The signed-in user info.
          this.user = this.getUserCredential(result);
          const responseInfoUser = await this.getInfoUser(result.user?.uid);
          return responseInfoUser;
        }).catch((error) => {
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          throw Error(error.message);
        });
      return response;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async signinwithgoogle(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const userData = this.getUserCredential(result);
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        return true;
      }).catch((error) => {
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(credential + ' : ' + error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async loginwithfacebook(): Promise<boolean> {
    try {
      const provider = new FacebookAuthProvider();
      provider.setDefaultLanguage('fr');
      provider.addScope('user_birthday');
      // provider.setCustomParameters({
      //   'display': 'popup'
      // });
      const auth = getAuth();
      let response = await signInWithPopup(auth, provider)
        .then(async (result) => {
          // The signed-in user info.
          this.user = this.getUserCredential(result);
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          const accessToken = credential ? credential.accessToken : null;
          const responseInfoUser = await this.getInfoUser(result.user?.uid);
          return responseInfoUser;
        })
        .catch((error) => {
          // The AuthCredential type that was used.
          const credential = FacebookAuthProvider.credentialFromError(error);
          throw Error(error.message);
        });
      return response;
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async signinwithfacebook(firstReview: Review, firstLesson: Lesson): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    const auth = getAuth();
    let responseInfoUser = false;
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const userData = this.getUserCredential(result);
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        return true;
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    if (response) {
      responseInfoUser = await this.addInfoUser(this.user.uid, firstReview, firstLesson);
    }
    return response && responseInfoUser;
  }

  async logout() {
    this.updateDayDisconnected('users', this.user.uid ? this.user.uid : '');
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
    this.reviewService.getPreviousReviews(nextReview).then(() => {});    
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

  async updateDayConnected(nameObject: string, uid: string) {
    this.timer = new Date();
    const userRef = doc(getFirestore(), nameObject, uid);
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

  async delay(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

}