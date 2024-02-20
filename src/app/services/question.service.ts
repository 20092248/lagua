import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { getDocs, collection, query, where, collectionGroup } from '@firebase/firestore';
import { Question } from '../model/question.model';
import { ParamReview } from '../model/paramReview.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  type: string = '';
  questions: any = {};
  nbrQuestion: number = 0;

  constructor(private _auth: Auth, private _firestore: Firestore, private alertService: AlertService) { }

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

  async findQuestions(collection: string, param: ParamReview): Promise<any> {
    const q = query(collectionGroup(getFirestore(), collection), where('category', '==', param.category), where('lesson', '==', param.lesson), where('order', '==', param.order));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      if (querySnapshot.size > 1) {
        this.alertService.presentToast('ATTENTION PLUS DE 1 DOCUMENT!', 2000, 'danger');
      }
      this.questions = querySnapshot.docs[0].data();
      this.questions.id = querySnapshot.docs[0].id;
    } else {
      console.log('Impossible de récupérer la liste de questions.');
    }
    return this.questions;
  }

  async updateQuestion(collection: string, document: string, question: Question): Promise<any> {
    const docRef = doc(getFirestore(), collection, document);
    delete question.id;
    await updateDoc(docRef, {
      category: question.category,
      lesson: Number(question.lesson),
      order: Number(question.order),
      // qcm: question.qcm,
      questions: question.qcm.questions
    });
    question.id = document;
  }

}