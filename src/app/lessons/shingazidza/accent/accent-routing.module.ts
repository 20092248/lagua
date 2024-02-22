import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccentPage } from './accent.page';

const routes: Routes = [
  {
    path: '',
    component: AccentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccentPageRoutingModule {}
