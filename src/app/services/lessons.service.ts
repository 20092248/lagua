import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { getDocs, collection, query } from '@firebase/firestore';
import { Lessons } from '../model/lessons.model';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(private _firestore: Firestore) { }

  async searchLessons(): Promise<Lessons[]> {
    const lessons: Lessons[] = [];
    const q = query(collection(getFirestore(), 'lessons'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => lessons.push(doc.data() as Lessons));
    return lessons;
  }

}