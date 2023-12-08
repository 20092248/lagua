import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';

const THEME_KEY = 'selected-app-theme';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: any[] = [];

  constructor(private _firestore: Firestore) { }

  async getDialogs(category: string) {
    const q = query(collection(getFirestore(), 'dialogs'), where('category', '==', category), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.dialogs.push(doc.data()));
    return this.dialogs;
  }

  async updateChats(collection: string, document: string, data: any[]): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await updateDoc(docRef, {
      chats: data
    });
  }

}
