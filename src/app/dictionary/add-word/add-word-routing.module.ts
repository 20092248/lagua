import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWordPage } from './add-word.page';

const routes: Routes = [
  {
    path: '',
    component: AddWordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWordPageRoutingModule {}
