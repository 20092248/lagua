import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirststepPage } from './firststep.page';

const routes: Routes = [
  {
    path: '',
    component: FirststepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirststepPageRoutingModule {}
