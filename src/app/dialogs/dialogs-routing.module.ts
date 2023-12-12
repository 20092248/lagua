import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialogsPage } from './dialogs.page';

const routes: Routes = [
  {
    path: '',
    component: DialogsPage
  }, {
    path: ':dialog',
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  }, {
    path: 'modify-review/:id',
    loadChildren: () => import('./modify-dialog/modify-dialog.module').then( m => m.ModifyDialogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogsPageRoutingModule {}
