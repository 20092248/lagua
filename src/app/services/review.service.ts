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
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), orderBy('order'));
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

  nextReview(review: Review) {
      const reviewByCategory = this.reviews.filter(r => r.category === review.category).sort((a, b) => a.lesson - b.lesson).sort((a, b) => a.order - b.order);
      const nbrLesson = reviewByCategory.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
      console.log([nbrLesson.values()]);
      // if (userReview.order === reviewByCategory.length) {
      //   this.getReview(this.nextCategory(this.authentificationService.user.review.category), 1, 1).then((value: Review) => {
      //     this.review = value;
      //   });
      // } else {
      //   this.getReview(this.nextCategory(this.authentificationService.user.review.category), 1, 1).then((value: Review) => {
      //     this.review = value;
      //   });
      // }
    return null;
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
    return category;
  }

}