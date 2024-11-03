import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'dictionary',
        loadChildren: () => import('../dictionary/dictionary.module').then(m => m.DictionaryPageModule)
      },
      {
        path: 'lessons',
        loadChildren: () => import('../lessons/lesson.module').then(m => m.LessonsPageModule),
      },
      {
        path: 'review',
        loadChildren: () => import('../review/review.module').then(m => m.ReviewPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'topics',
        loadChildren: () => import('../topics/topics.module').then( m => m.TopicsPageModule)
      },
      {
        path: 'dialogs',
        loadChildren: () => import('../dialogs/dialogs.module').then( m => m.DialogsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
