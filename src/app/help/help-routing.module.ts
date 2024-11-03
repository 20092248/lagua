import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpPage } from './help.page';

const routes: Routes = [
  {
    path: '',
    component: HelpPage
  },
  {
    path: 'firststep',
    loadChildren: () => import('./firststep/firststep.module').then( m => m.FirststepPageModule)
  },
  {
    path: 'accountmanagement',
    loadChildren: () => import('./accountmanagement/accountmanagement.module').then( m => m.AccountmanagementPageModule)
  },
  {
    path: 'reviewing',
    loadChildren: () => import('./reviewing/reviewing.module').then( m => m.ReviewingPageModule)
  },
  {
    path: 'learning',
    loadChildren: () => import('./learning/learning.module').then( m => m.LearningPageModule)
  },
  {
    path: 'contactus',
    loadChildren: () => import('./contactus/contactus.module').then( m => m.ContactusPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpPageRoutingModule {}
