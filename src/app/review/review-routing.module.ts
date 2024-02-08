import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewPage } from './review.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewPage
  },
  {
    path: 'add-review',
    loadChildren: () => import('./add-review/add-review.module').then( m => m.AddReviewPageModule)
  },
  {
    path: 'add-lesson',
    loadChildren: () => import('./add-lesson/add-lesson.module').then( m => m.AddLessonsPageModule)
  },
  {
    path: 'modify-review/:id',
    loadChildren: () => import('./modify-review/modify-review.module').then( m => m.ModifyReviewPageModule)
  },
  {
    path: 'modify-category/:id',
    loadChildren: () => import('./modify-category/modify-category.module').then( m => m.ModifyCategoryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewPageRoutingModule {}
