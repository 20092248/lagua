import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionsPage } from './questions.page';


const routes: Routes = [
  {
    path: '',
    component: QuestionsPage,
    children: [
      {
        path: 'preview',
        loadChildren: () => import('./preview/preview.module').then(m => m.PreviewPageModule)
      },
      {
        path: 'type',
        loadChildren: () => import('./type/type.module').then(m => m.TypePageModule)
      },
      {
        path: 'qcm',
        loadChildren: () => import('./qcm/qcm.module').then(m => m.QcmPageModule)
      },
      {
        path: 'memo',
        loadChildren: () => import('./memo/memo.module').then(m => m.MemoPageModule)
      },
      {
        path: 'translate',
        loadChildren: () => import('./translate/translate.module').then(m => m.TranslatePageModule)
      },
      {
        path: 'spell',
        loadChildren: () => import('./spell/spell.module').then(m => m.SpellPageModule)
      },
      {
        path: 'mix',
        loadChildren: () => import('./mix/mix.module').then(m => m.MixPageModule)
      },
      {
        path: 'result',
        loadChildren: () => import('./result/result.module').then(m => m.ResultPageModule)
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
