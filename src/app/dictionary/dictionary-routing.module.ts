import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DictionaryPage } from './dictionary.page';

const routes: Routes = [
  {
    path: '',
    component: DictionaryPage,
  },
  {
    path: 'add',
    loadChildren: () => import('./add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'add-word',
    loadChildren: () => import('./add-word/add-word.module').then( m => m.AddWordPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionaryPageRoutingModule {}
