import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs, setDoc, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';

const THEME_KEY = 'selected-app-theme';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: any[] = [];
  chats: any = {};

  constructor(private _firestore: Firestore) { }

  async getDialogs(category: string) {
    this.dialogs = [];
    const q = query(collection(getFirestore(), 'dialogs'), where('category', '==', category), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.dialogs.push(doc.data()));
    return this.dialogs;
  }

  async getChats(collection: string, document: string): Promise<any> {
    const chatRef = doc(getFirestore(), collection, document);
    const docSnap = await getDoc(chatRef);
    if (docSnap.exists()) {
      const dialog = docSnap.data();
      this.chats = dialog['chats'] ? dialog['chats'] : [];
    }
    return this.chats;
  }

  async updateChats(collection: string, document: string, data: any[]): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await updateDoc(docRef, {
      chats: data
    });
  }

  async createChats(collection: string, document: string, data: any[]): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await setDoc(docRef, {
      chats: data
    });
  }

}
