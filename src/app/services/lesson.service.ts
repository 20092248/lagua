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
  recommendedLesson: Lesson[] = [];
  resultLessons: Lesson[] = [];

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

  async findNextLesson(lesson: Lesson) {
    const nextOrder = lesson.order + 1;
    return await this.getLesson(nextOrder).then((l: Lesson) => {
      return l;
    });
  }

  getRecommendedLesson(code: string, lessons: Lesson[]) {
    if (code === '0') { // Découverte
      this.recommendedLesson = lessons.slice(0, 3);
    } else if (code === '1') { // Débutant
      this.recommendedLesson = lessons.slice(2, 5);
    } else if (code === '2') { // Intermédiaire
      this.recommendedLesson = lessons.slice(3, 6);
    } else if (code === '3') { // Intermediaire avancé
      this.recommendedLesson = lessons.slice(4, 7);
    } else if (code === '4') { // Avancé
      this.recommendedLesson = lessons.slice(5, 8);
    }
    return this.recommendedLesson;
  }

}