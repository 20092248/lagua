import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { doc, getDocs, updateDoc, collection, query, where } from '@firebase/firestore';
import { Review } from '../model/review.model';
import { ResultReview } from '../model/resultReview.model';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviews: Review[] = [];
  review: Review = {} as Review;
  nextReview: Review = {} as Review;
  resultReviews: ResultReview[] = [];
  resultReview: ResultReview = new ResultReview();

  constructor(private _firestore: Firestore) { }

  async getAllReviews(): Promise<Review[]> {
    this.reviews = [];
    const q = query(collection(getFirestore(), 'reviews'), orderBy('order'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.reviews.push(doc.data() as Review));
    return this.reviews;
  }

  async getReviewsByCategory(category: string): Promise<Review[]> {
    this.reviews = [];
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), orderBy('lesson'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.reviews.push(doc.data() as Review));
    return this.reviews;
  }

  async getReview(category: string, lesson: number, order: number): Promise<Review> {
    this.review;
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), where('lesson', '==', lesson), where('order', '==', order));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.review = doc.data() as Review);
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
    const reviewByCategory = this.reviews.filter(r => r.category === review.category).sort((a, b) => a.lesson - b.lesson).sort((a, b) => a.order - b.order);
    const countLessonAndOrder = reviewByCategory.reduce((acc, e) => acc.set(e.lesson, (acc.get(e.lesson) || 0) + 1), new Map());
    if (countLessonAndOrder.get(review.lesson) !== review.order + 1) { 
      this.nextReview = await this.getReview(review.category, review.lesson, review.order + 1).then((value: Review) => {
        return value;
      });
    } else if(countLessonAndOrder.get(review.lesson + 1)) { // toutes les leçons sont terminées et il reste des cours
      this.nextReview = await this.getReview(review.category, review.lesson + 1, 1).then((value: Review) => {
        return value;
      });
    } else { // toutes les leçons/cours sont terminées
      this.nextReview = await this.getReview(this.nextCategory(review.category), 1, 1).then((value: Review) => {
        return value;
      });
    }
    return this.nextReview;
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