import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConjugationPage } from './conjugation.page';

const routes: Routes = [
  {
    path: '',
    component: ConjugationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConjugationPageRoutingModule {}
