import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoPage } from './memo.page';

const routes: Routes = [
  {
    path: '',
    component: MemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoPageRoutingModule {}
