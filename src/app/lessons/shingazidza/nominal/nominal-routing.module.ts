import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NominalPage } from './nominal.page';

const routes: Routes = [
  {
    path: '',
    component: NominalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NominalPageRoutingModule {}
