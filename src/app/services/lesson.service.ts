import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { getDocs, collection, query, where } from '@firebase/firestore';
import { Lesson } from '../model/lesson.model';
import { LessonMin } from '../model/lessonMin.model';
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
    querySnapshot.forEach((doc) => {
      this.lessons.push(doc.data() as Lesson);
    });
    return this.lessons;
  }

  async getLesson(order: number): Promise<Lesson> {
    const q = query(collection(getFirestore(), 'lessons'), where('order', '==', order));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.lesson = doc.data() as Lesson);
    return this.lesson;
  }

  async getLessonByCode(code: string): Promise<Lesson> {
    const q = query(collection(getFirestore(), 'lessons'), where('code', '==', code));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.lesson = doc.data() as Lesson);
    return this.lesson;
  }

  async findNextLesson(lesson: LessonMin) {
    if(this.lessons.length === lesson.order) { // DERNIERE LECON
      return lesson;
    } else {
      const nextOrder = lesson.order + 1;
      return await this.getLesson(nextOrder).then((l: LessonMin) => {
        return { order: l.order, code: l.code, navigate: l.navigate, title: l.title, subTitle: l.subTitle } as LessonMin;
      });
    }
  }

}