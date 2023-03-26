import { Component, OnInit } from '@angular/core';
import { Review } from '../model/review.model';
import { ReviewService } from '../services/review.service';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  categorySelected: any;
  categories: any[] = [];
  reviews: Review[] = [];

  constructor(private settingsReview: SettingService, private reviewService: ReviewService) { }

  ngOnInit() {
    if(!this.categories.length){
      this.settingsReview.getCategories().then((data => {
        this.categories = data.categories;        
        this.categorySelected = data.categories[0];
      }));
    }
    this.reviewService.getReview('A1').then((data: Review[]) =>{
      this.reviews = data;
      console.log(data);
    });
  }

  setCategory(code: string) {
    this.reviews = [];
    this.categorySelected = this.categories.find(c => c.code === code);
    this.reviewService.getReview(code).then((data: Review[]) =>{
      console.log(data);
      this.reviews = data;
    });
  }

}
