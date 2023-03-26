import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FromPage } from './from.page';

const routes: Routes = [
  {
    path: '',
    component: FromPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FromPageRoutingModule {}
