import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { doc, updateDoc, getDocs, collection, query, where } from '@firebase/firestore';
import { Lesson } from '../model/lessons.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  
  lessons: Lesson[] = [];
  lesson: Lesson = {} as Lesson;

  constructor(private _firestore: Firestore) { }

  async searchLessons(): Promise<Lesson[]> {
    const q = query(collection(getFirestore(), 'lessons'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.lessons.push(doc.data() as Lesson));
    return this.lessons;
  }

  async getLesson(order: number): Promise<Lesson> {
    const q = query(collection(getFirestore(), 'lessons'), where('order', '==', order));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.lesson = doc.data() as Lesson);
    return this.lesson;
  }

  async updateLessons(data: any, nameObject: string, uid: string) {
    const lessonsRef = doc(getFirestore(), nameObject, uid);
    await updateDoc(lessonsRef, {
      lessons: data
    });
  }

}