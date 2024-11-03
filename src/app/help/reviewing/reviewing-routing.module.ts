import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewingPage } from './reviewing.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewingPageRoutingModule {}
