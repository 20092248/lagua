import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDoc, collection, setDoc, addDoc, query, getDocs } from '@firebase/firestore';
import { Platform } from '@ionic/angular';
import { Question } from '../model/question.model';
import { GlobalParam } from '../model/globalParam.model';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  userInformation: any = {};
  questions: any = {};
  reviews: any = {};
  profile: any = {};
  topics: any = {};
  home: any = {};
  parameter: any = {};
  isCapacitor: boolean;
  isMobile: boolean;
  isOverlay: boolean;

  constructor(private _firestore: Firestore, private platform: Platform) {
    this.isCapacitor = this.platform.is('capacitor');
    this.isMobile = this.platform.width() < 820 || this.platform.width() < this.platform.height();
    this.isOverlay = false;
  }


  async getSettings(): Promise<GlobalParam> {
    const querySnapshot = await getDocs(query(collection(getFirestore(), 'settings')));
    querySnapshot.forEach((doc) => {
      switch (doc.id) {
        case 'questions':
          this.questions = doc.data();
          break;
        case 'reviews':
          this.reviews = doc.data();
          break;
        case 'userInformation':
          this.userInformation = doc.data();
          break;
        case 'profile':
          this.profile = doc.data();
          break;
        case 'topics':
          this.topics = doc.data();
          break;
        case 'home':
          this.home = doc.data();
          break;
        case 'parameter':
          this.parameter = doc.data();
          break;
      }
    });
    return { questions: this.questions, reviews: this.reviews, userInformation: this.userInformation, profile: this.profile, topics: this.topics, home: this.home, parameter: this.parameter };
  }

  async getSetting(document: string): Promise<any> {
    var settingsReview: any = {};
    const docRef = doc(getFirestore(), 'settings', document);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      settingsReview = docSnap.data();
    } else {
      console.log('Impossible de récupérer les infos du cours.');
    }
    return settingsReview;
  }

  async getUserInformation(): Promise<any> {
    const docRef = doc(getFirestore(), 'settings', 'userInformation');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.userInformation = docSnap.data();
    } else {
      console.log('Impossible de récupérer les infos du cours.');
    }
    return this.userInformation;
  }

  async createCollection(col: string, values: any[]) {
    values.forEach(async data => {
      const docRef = await addDoc(collection(getFirestore(), col), data);
      console.log("Document written with ID: ", docRef.id);
    });
  }

  async createDocument(collection: string, document: string, value: any) {
    await setDoc(doc(getFirestore(), collection, document), value);
  }

  async createDocumentAndGenerateId(col: string, value: Question) {
    delete value.id;
    const docRef = await addDoc(collection(getFirestore(), col), value);
    console.log("Document written with ID: ", docRef.id);
    value.id = docRef.id;
    return value;
  }
}