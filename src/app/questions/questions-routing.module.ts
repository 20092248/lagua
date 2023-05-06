import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsPage } from './questions.page';


const routes: Routes = [
  {
    path: '',
    component: QuestionsPage,
    children: [
      {
        path: 'type',
        loadChildren: () => import('./type/type.module').then(m => m.TypePageModule)
      },
      {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(m => m.ContentPageModule)
      },
      {
        path: '',
        redirectTo: '/questions/type',
        pathMatch: 'full'
      }]
  },
  {
    path: '',
    redirectTo: '/questions/type',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionsPageRoutingModule { }
