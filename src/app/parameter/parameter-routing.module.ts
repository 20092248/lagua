import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParameterPage } from './parameter.page';

const routes: Routes = [
  {
    path: '',
    component: ParameterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterPageRoutingModule {}
