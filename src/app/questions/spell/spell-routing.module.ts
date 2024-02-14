import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpellPage } from './spell.page';

const routes: Routes = [
  {
    path: '',
    component: SpellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpellPageRoutingModule {}
