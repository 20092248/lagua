import { Injectable } from '@angular/core';
import { Firestore, getFirestore, orderBy } from '@angular/fire/firestore';
import { getDocs, collection, query, where } from '@firebase/firestore';
import { Review } from '../model/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  review: Review[] = [];

  constructor(private _firestore: Firestore) { }

  async getReview(category: string): Promise<Review[]> {
    this.review = [];
    const q = query(collection(getFirestore(), 'reviews'), where('category', '==', category), orderBy('order'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => this.review.push(doc.data() as Review));
    return this.review;
  }

}