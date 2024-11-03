import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalNoticesPage } from './legal-notices.page';

const routes: Routes = [
  {
    path: '',
    component: LegalNoticesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalNoticesPageRoutingModule {}
