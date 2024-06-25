import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewGroup } from 'src/app/model/reviewGroup.model';
import { AlertService } from 'src/app/services/alert.service';
import { ReviewService } from 'src/app/services/review.service';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-modify-category',
  templateUrl: './modify-category.page.html',
  styleUrls: ['./modify-category.page.scss'],
})
export class ModifyCategoryPage implements OnInit {

  isOverlay: boolean | undefined;
  reviewGroup: ReviewGroup[] = [{ category: '', lesson: 0, order: 0, data: [], title: '', subtitle: '', reviews: [] }];
  paramCategory: string;

  constructor(private route: ActivatedRoute, private reviewService: ReviewService, private alertService: AlertService, private settingService: SettingService) {
    this.paramCategory = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.isOverlay = this.settingService.isOverlay;
    this.reviewService.getReviewsByCategory(this.paramCategory).then(reviewGroup => {
      this.reviewGroup = reviewGroup;
      this.reviewGroup.forEach(group => {
        group.reviews.forEach(review => {
          review.content = review.contents.join();
        });
      });
    });
  }

  addMenu(index: number) {
    const reviewGroup = { ...this.reviewGroup[index] };
    this.reviewGroup.splice(index + 1, 0, reviewGroup);
  }

  removeMenu(index: number) {
    this.reviewGroup.splice(index, 1);
  }

  addReview(index: number, indexReview: number) {
    const review = { ...this.reviewGroup[index].reviews[indexReview] };
    this.reviewGroup[index].reviews.splice(indexReview + 1, 0, review);
  }

  removeReview(index: number, indexReview: number) {
    this.reviewGroup[index].reviews.splice(indexReview, 1);
  }

  addContent(index: number, indexReview: number, indexContent: number) {
    const content = JSON.stringify(this.reviewGroup[index].reviews[indexReview].contents[indexContent]);
    this.reviewGroup[index].reviews[indexReview].contents.splice(indexContent + 1, 0, content);
  }

  removeContent(index: number, indexReview: number, indexContent: number) {
    this.reviewGroup[index].reviews[indexReview].contents.splice(indexContent, 1);
  }

  copyReview() {
    const newCategory = { category: '', lesson: 0, order: 0, data: [], title: '', subtitle: '', reviews: [{ category: '', contents: [], lesson: 0, order: 0, text: '', translate: '', score: 0 }] };
    this.settingService.createDocumentAndGenerateId('reviews', newCategory).then((result) => {
      this.reviewGroup = [newCategory];
      this.alertService.presentToast('Copie réussie', 3000, 'lagua');
    },
      () => this.alertService.presentToast('Erreur lors de la copie', 3000, 'lagua'));
  }

  saveReview() {
    this.alertService.presentActionSheetConfirmation('Confirmation', 'Êtes-vous sur de modifier le menu?', 'action-sheet-success').then(actionSheetResult => {
      if (actionSheetResult.role === 'selected') {
        this.reviewGroup.forEach(rg => {
          if (rg.id) {
            rg.reviews.forEach(r => { r.contents = r.content ? r.content?.split(',') : []; delete r.content; r.order = Number(r.order); r.lesson = Number(rg.lesson); });
            this.reviewService.updateMenuReview(rg.id, rg).then(() => {
              rg.reviews.forEach(r => { r.content = r.contents.join(); });
              this.alertService.presentToast('Le menu a été mise a jour.', 3000, 'lagua');
            }, () => this.alertService.presentToast('La mise à jour a échoué!', 3000, 'danger'));
          }
        });
      }
    });
  }

}
