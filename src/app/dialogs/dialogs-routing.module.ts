import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogsPage } from './dialogs.page';

const routes: Routes = [
  {
    path: '',
    component: DialogsPage
  }, {
    path: ':dialogs',
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogsPageRoutingModule {}
