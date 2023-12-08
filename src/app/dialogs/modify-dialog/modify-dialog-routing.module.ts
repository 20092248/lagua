import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifyDialogPage } from './modify-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: ModifyDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifyDialogPageRoutingModule {}
