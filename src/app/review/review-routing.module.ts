import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewPage } from './review.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewPage
  },
  {
    path: 'add',
    loadChildren: () => import('./add-review/add-review.module').then( m => m.AddReviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewPageRoutingModule {}
