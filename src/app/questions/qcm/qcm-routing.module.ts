import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QcmPage } from './qcm.page';

const routes: Routes = [
  {
    path: '',
    component: QcmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QcmPageRoutingModule {}
