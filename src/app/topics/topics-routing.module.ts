import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicsPage } from './topics.page';

const routes: Routes = [
  {
    path: '',
    component: TopicsPage,
    children: [
      {
        path: ':topic',
        loadChildren: () => import('../topics/detail/detail.component').then(m => m.DetailComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicsPageRoutingModule {}
