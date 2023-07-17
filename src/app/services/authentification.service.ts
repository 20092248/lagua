import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
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

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  user: User = {};
  timer: Date = new Date();

  constructor(private _auth: Auth, private _firestore: Firestore, private reviewService: ReviewService, private lessonService: LessonService) { }

  checkUserState() {
    if (getAuth() && getAuth().currentUser) {
      const user = getAuth().currentUser;
      this.user.uid = user?.uid;
      this.user.email = user?.email;
      this.user.displayName = user?.displayName;
      this.user.photoURL = user?.photoURL;
    }
    return getAuth() && getAuth().currentUser;
  }

  async getInfoUser(uid: string) {
    await this.updateDayConnected('users', uid);
    const document = await getDoc(doc(getFirestore(), 'users', uid));
    const data = document.data() as User;
    this.user.uid = data.uid;
    this.user.email = data.email;
    this.user.displayName = data.displayName;
    this.user.age = data.age;
    this.user.learn = data.learn as CodeTextTranslate;
    this.user.why = data.why as CodeLabel;
    this.user.time = data.time as CodeLabel;
    this.user.level = data.level as CodeLabel;
    this.user.review = data.review as Review;
    this.user.lesson = data.lesson as Lesson;
    this.user.resultReviews = data.resultReviews as ResultReview[];
    this.user.resultLessons = data.resultLessons;
    this.user.week = data.week;
    this.user.timerActiveConnection = data.timerActiveConnection ? data.timerActiveConnection : 0;
  }

  async addInfoUser(uid: string) {
    forkJoin([this.reviewService.getReview('A1', 1, 1), this.lessonService.getLesson(1)]).subscribe(async ([review, lesson]) => {
      await this.reviewService.getReview('A1', 1, 1).then(async review => {
        setDoc(doc(getFirestore(), 'users', uid), {
          age: this.user.age,
          learn: this.user.learn,
          why: this.user.why,
          time: this.user.time,
          level: this.user.level,
          review: review,
          lesson: lesson
        }, { merge: true });
        this.getInfoUser(uid);
      });
    });
  }

  async login(email: string, password: string) {
    signInWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
      const user = userCredential.user;
      this.getInfoUser(user?.uid);
    })
      .catch((error) => {
        console.error(error.code + ' : ' + error.message);
      }); //connexion
  }

  async createUser(name: string, email: string, password: string) {
    let response = await createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        this.user.displayName = name;
        this.user.email = userCredential?.user?.email;
        this.user.uid = userCredential?.user?.uid;
        setDoc(doc(getFirestore(), 'users', this.user.uid), this.user);
        this.addInfoUser(userCredential?.user?.uid);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
    return response;
  }

  async loginwithgoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        this.user = result.user as User;
        this.getInfoUser(result.user?.uid);
        return true;
      }).catch((error) => {
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async signinwithgoogle(): Promise<boolean> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const userData = result.user as User;
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        this.addInfoUser(result.user?.uid);
        return true;
      }).catch((error) => {
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async loginwithfacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        this.user = result.user as User;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        this.getInfoUser(result.user?.uid);
        return true;
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async signinwithfacebook(): Promise<boolean> {
    const provider = new FacebookAuthProvider();
    provider.setDefaultLanguage('fr');
    provider.addScope('user_birthday');
    // provider.setCustomParameters({
    //   'display': 'popup'
    // });
    const auth = getAuth();
    let response = await signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const userData = result.user as User;
        this.user.uid = userData.uid;
        this.user.email = userData.email;
        this.user.displayName = userData.displayName;
        this.user.photoURL = userData.photoURL;
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential ? credential.accessToken : null;
        this.addInfoUser(result.user?.uid);
        return true;
      })
      .catch((error) => {
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error(error);
        return false;
      });
    return response;
  }

  async logout() {
    this.updateDayDisconnected('users', this.user.uid ? this.user.uid : '');
    return signOut(getAuth()).then(() => {
      this.user = {} as User;
      console.log('sign-out successful.');
    }).catch((error) => {
      console.error(error);
    });
  }

  async updateResultReview(data: any, nameObject: string, uid: string) {
    if (!this.user.resultReviews) {
      this.user.resultReviews = [];
    }
    this.user.resultReviews.push(data);
    const userRef = doc(getFirestore(), nameObject, uid);
    await updateDoc(userRef, {
      review: this.reviewService.findNextReview(this.user.review),
      resultReviews: this.user.resultReviews.map((obj) => { return Object.assign({}, obj) })
    });
  }

  async updateLesson(data: any, nameObject: string, uid: string) {
    const lessonsRef = doc(getFirestore(), nameObject, uid);
    this.lessonService.findNextLesson(this.user.lesson).then(async lesson => {
      this.user.lesson = lesson;
      if (!this.user.resultLessons) {
        this.user.resultLessons = [];
      }
      this.user.resultLessons.push(data);
      await updateDoc(lessonsRef, {
        lesson: lesson,
        resultLessons: this.user.resultLessons.map((obj) => { return Object.assign({}, obj) })
      });
    });
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
    if(this.user?.timerActiveConnection != undefined && this.user?.timerActiveConnection != null) {
      await updateDoc(userRef, {
        timerActiveConnection: this.user?.timerActiveConnection + (dateDisconnected.getTime() - this.timer.getTime())
      });
    }
  }


}