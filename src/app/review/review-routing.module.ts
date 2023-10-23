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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewPageRoutingModule {}
