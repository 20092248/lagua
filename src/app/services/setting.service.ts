import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDoc, collection, setDoc, addDoc, query, getDocs } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  userInformation: any | undefined;
  questions: any | undefined;
  reviews: any | undefined;

  constructor(private _firestore: Firestore) { }


  async getSettings(): Promise<boolean> {
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
      }
      console.log(doc.id, ' => ', doc.data());
    });
    return true;
  }

  async getSetting(document: string): Promise<any> {
    var settingsReview: any | undefined;
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
}