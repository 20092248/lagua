import { Injectable } from '@angular/core';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { doc, getDocs, updateDoc, collection, query, where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private _firestore: Firestore) { }

  async updateDictionary(word: any) {
    const dictionayRef = doc(getFirestore(), 'shindzuani-francais', 'b');
    await updateDoc(dictionayRef, { responses: word });
  }

  async searchWord(word: string) {
    const q = query(collection(getFirestore(), "shindzuani-francais"), where("capital", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }

}