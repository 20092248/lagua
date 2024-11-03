import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyCategoryPage } from './modify-category.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyCategoryPageRoutingModule {}
