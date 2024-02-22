import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerbalPage } from './verbal.page';

const routes: Routes = [
  {
    path: '',
    component: VerbalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerbalPageRoutingModule {}
