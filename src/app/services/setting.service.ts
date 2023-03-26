import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { doc, getDoc, getDocs, collection, query } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  settingsReview: any | undefined;

  constructor(private _firestore: Firestore) { }

  async getCategories(): Promise<any> {

    const docRef = doc(getFirestore(), 'settings', 'review');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.settingsReview =  docSnap.data();
    } else {
      console.log('Impossible de récupérer les infos du cours.');
    }
    return this.settingsReview;

  }

}