import { Injectable } from '@angular/core';
import { Firestore, addDoc, getDoc, getFirestore, orderBy, setDoc } from '@angular/fire/firestore';
import { doc, getDocs, updateDoc, collection, query, where } from '@firebase/firestore';
import { Review } from '../model/review.model';
import { ResultReview } from '../model/resultReview.model';
import { AuthentificationService } from './authentification.service';
import { ReviewGroup } from '../model/reviewGroup.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviews: ReviewGroup[] = [];
  previousReviews: Review[] = [];
  review: Review = {} as Review;
  nextReview: Review = {} as Review;
  resultReviews: ResultReview[] = [];
  resultReview: ResultReview = new ResultReview();

  constructor(private _firestore: Firestore) { }

  async getAllReviews(): Promise<ReviewGroup[]> {
    this.reviews = [];
    const q = query(collection(getFirestore(), 'reviews'), orderBy('category'), orderBy('lesson'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.reviews.push(doc.data() as ReviewGroup));
    return this.reviews;
  }

  async getReviewsByCategory(category: string): Promise<ReviewGroup[]> {
    this.reviews = [];
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), orderBy('lesson'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.reviews.push(doc.data() as ReviewGroup));
    return this.reviews;
  }

  async getPreviousReviews(review: Review): Promise<Review[]> { //category: string, lesson: number, order: number
    this.previousReviews = [];
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', review.category), orderBy('lesson'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const reviewInfo = doc.data() as ReviewGroup;
      for (const r of reviewInfo.reviews) {
        if (review.lesson === r.lesson && review.order === r.order) {
          return;
        }
        this.previousReviews.push(r);
      }
    });
    return this.previousReviews;
  }

  async getReview(category: string, lesson: number, order: number): Promise<Review> {
    this.review;
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), where('lesson', '==', lesson));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const reviewInfo = doc.data();
      this.review = reviewInfo['reviews'].find((r: any) => r.order === order) as Review
    });
    return this.review;
  }

  async updateReview(uid: string, category: string, lesson: number, order: number) {
    const review = this.getReview(category, lesson, order);
    const userRef = doc(getFirestore(), 'users', uid);
    await updateDoc(userRef, {
      review: review
    });
  }

  async findNextReview(review: Review) {
    const reviews = this.reviews ? this.reviews.find(r => r.category === review.category && r.lesson === review.lesson)?.reviews : [];
    const order = reviews ? reviews?.findIndex(r => r.order === review.order) : 0;
    if (reviews && reviews.length !== order) {
      this.nextReview = reviews[order + 1];
    } else if (reviews && reviews.length === order && this.reviews.find(r => r.category === review.category && r.lesson === review.lesson + 1)) { // toutes les leçons sont terminées et il reste des cours
      this.nextReview = await this.getReview(review.category, review.lesson + 1, 1).then((value: Review) => { return value; });
    } else { // toutes les leçons/cours sont terminées
      this.nextReview = await this.getReview(this.nextCategory(review.category), 1, 1).then((value: Review) => { return value; });
    }
    // const countLessonAndOrder = reviewByCategory.reduce((acc, e) => acc.set(e.lesson, (acc.get(e.lesson) || 0) + 1), new Map());
    // if (countLessonAndOrder.get(review.lesson) !== review.order + 1) { 
    //   this.nextReview = await this.getReview(review.category, review.lesson, review.order + 1).then((value: Review) => {
    //     return value;
    //   });
    // } else if(countLessonAndOrder.get(review.lesson + 1)) { 
    //   this.nextReview = await this.getReview(review.category, review.lesson + 1, 1).then((value: Review) => {
    //     return value;
    //   });
    // } else { 
    //   this.nextReview = await this.getReview(this.nextCategory(review.category), 1, 1).then((value: Review) => {
    //     return value;
    //   });
    // }
    return this.nextReview;
  }

  async updateLessonInReview(collectionSrc: string, category: string, lesson: string, order: string, sourceCategory: string, sourceLesson: string, sourceOrder: string) {
    const sourceQuestion = await getDoc(doc(getFirestore(), collectionSrc, sourceCategory + '_' + sourceLesson + '_' + sourceOrder));
    const questionRef = doc(getFirestore(), collectionSrc, category + '_' + lesson + '_' + order);
    const question = await getDoc(questionRef);
    const sourceData = sourceQuestion.data() as any;
    const data = question.data() as any;
    console.log('source', sourceData.qcm.questions);
    console.log('destination', data.qcm.questions);
    const merge = data.qcm.questions.concat(sourceData.qcm.questions);
    console.log('ajout', merge);
    await updateDoc(questionRef, {
      'qcm.questions': merge
    });
  }

  async moveOneLessonToPosition(collectionSrc: string, document: string, position: number) {
    const questionRef = doc(getFirestore(), collectionSrc, document);
    const question = await getDoc(questionRef);
    const data = question.data() as any;
    console.log('destination', data.reviews);
    data.reviews.splice(position, 0, data.reviews[position]);
    console.log('ajout', data.reviews);
    await updateDoc(questionRef, {
      'reviews': data.reviews
    });
  }

  async copyCollection(collectionSrc: string, category: string, review: string, sourceCategory: string, sourceLesson: string) {
    const q = query(collection(getFirestore(), collectionSrc));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const id = document.id.split('_');
      const collectionAndLesson = sourceCategory + '_' + sourceLesson;
      if (collectionAndLesson.indexOf(category) !== -1) {
        await setDoc(doc(getFirestore(), collectionSrc, category + '_' + review + '_' + id[2]), document.data());
      }
    });
  }

  async copyDoc(srcCollection: string, category: string, lesson: number, sourceCategory: string, sourceLesson: number) {
    const q = query(collection(getFirestore(), srcCollection), where('category', '==', sourceCategory), where('lesson', '==', sourceLesson));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const newData = document.data();
      newData['category'] = category;
      newData['lesson'] = lesson;
      const newCollectionId = await addDoc(collection(getFirestore(), srcCollection), newData);
      console.log(newCollectionId.id);
    });
  }

  nextCategory(category: string) {
    var nextCategory = '';
    switch (category) {
      case 'A1':
        nextCategory = 'A2'
        break;
      case 'A2':
        nextCategory = 'B1'
        break;
      case 'B1':
        nextCategory = 'B2'
        break;
      case 'B2':
        nextCategory = 'C1'
        break;
      default:
        break;
    }
    return nextCategory;
  }

  getCategoryLevel(category: string) {
    var level = 0;
    switch (category) {
      case 'A1':
        level = 0
        break;
      case 'A2':
        level = 1
        break;
      case 'B1':
        level = 2
        break;
      case 'B2':
        level = 3
        break;
      case 'C1':
        level = 4
        break;
      default:
        break;
    }
    return level;
  }

}