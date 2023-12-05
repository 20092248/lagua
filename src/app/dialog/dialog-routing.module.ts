import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogPage } from './dialog.page';

const routes: Routes = [
  {
    path: '',
    component: DialogPage
  }, {
    path: ':dialog',
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogPageRoutingModule {}
