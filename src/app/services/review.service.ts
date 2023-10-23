import { Injectable } from '@angular/core';
import { Firestore, addDoc, getFirestore, orderBy, setDoc } from '@angular/fire/firestore';
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

  async copyCollection(oldCollection: string, category: string, review: string) {
    const q = query(collection(getFirestore(), oldCollection));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const id = document.id.split('_');
      if(document.id.indexOf(category) !== -1){
        await setDoc(doc(getFirestore(), 'shindzuani_francais_questions', id[0] + '_' + review + '_' + id[1]), document.data());
      }
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