import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { IsLoggedGuard } from './shared/is-logged.guard';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'signin', canActivate: [IsLoggedGuard],
    loadChildren: () => import('./signin/signin.module').then(m => m.SignInPageModule)
  },
  {
    path: 'login', canActivate: [IsLoggedGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginInPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewPageModule)
  },
  {
    path: 'firstpage',
    loadChildren: () => import('./firstpage/firstpage.module').then(m => m.FirstpagePageModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsPageModule),
  },
  {
    path: 'user-information',
    children: [
      {
        path: 'learn',
        loadChildren: () => import('./user-information/learn/learn.module').then(m => m.LearnPageModule)
      },
      {
        path: 'level',
        loadChildren: () => import('./user-information/level/level.module').then(m => m.LevelPageModule)
      },
      {
        path: 'time',
        loadChildren: () => import('./user-information/time/time.module').then(m => m.TimePageModule)
      },
      {
        path: 'why',
        loadChildren: () => import('./user-information/why/why.module').then(m => m.WhyPageModule)
      },
      {
        path: 'age',
        loadChildren: () => import('./user-information/age/age.module').then(m => m.AgePageModule)
      }
    ]
  }



  // {
  //   path: 'firstpage',
  //   loadChildren: () => import('./firstpage/firstpage.module').then( m => m.FirstpagePageModule)
  // },
  // {
  //   path: 'user-information/learn',
  //   loadChildren: () => import('./user-information/learn/learn.module').then( m => m.LearnPageModule)
  // },
  // {
  //   path: 'level',
  //   loadChildren: () => import('./user-information/level/level.module').then( m => m.LevelPageModule)
  // },
  // {
  //   path: 'from',
  //   loadChildren: () => import('./user-information/from/from.module').then( m => m.FromPageModule)
  // },
  // {
  //   path: 'why',
  //   loadChildren: () => import('./user-information/why/why.module').then( m => m.WhyPageModule)
  // },
  // {
  //   path: 'age',
  //   loadChildren: () => import('./user-information/age/age.module').then( m => m.AgePageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
