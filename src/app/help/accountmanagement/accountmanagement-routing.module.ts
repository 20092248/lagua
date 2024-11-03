import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountmanagementPage } from './accountmanagement.page';

const routes: Routes = [
  {
    path: '',
    component: AccountmanagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountmanagementPageRoutingModule {}
