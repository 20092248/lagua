import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc, getFirestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  type: string = '';
  questions: any = {};
  nbrQuestion: number = 0;

  constructor(private _auth: Auth, private _firestore: Firestore) { }

  async getQuestions(collection: string, document: string): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.questions = docSnap.data();
    } else {
      console.log('Impossible de récupérer la liste de questions.');
    }
    return this.questions;
  }

  async updateQuestion(collection: string, document: string, data: any[]): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    await updateDoc(docRef, {
      qcm: { questions: data }
    });
  }
}