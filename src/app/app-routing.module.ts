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
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewPageModule)
  },
  {
    path: 'conjugation',
    loadChildren: () => import('./lessons/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: 'firstpage',
    loadChildren: () => import('./firstpage/firstpage.module').then(m => m.FirstpagePageModule)
  },
  {
    path: 'information-user',
    children: [
      {
        path: 'learn',
        loadChildren: () => import('./information-user/learn/learn.module').then(m => m.LearnPageModule)
      },
      {
        path: 'level',
        loadChildren: () => import('./information-user/level/level.module').then(m => m.LevelPageModule)
      },
      {
        path: 'from',
        loadChildren: () => import('./information-user/from/from.module').then(m => m.FromPageModule)
      },
      {
        path: 'why',
        loadChildren: () => import('./information-user/why/why.module').then(m => m.WhyPageModule)
      },
      {
        path: 'age',
        loadChildren: () => import('./information-user/age/age.module').then(m => m.AgePageModule)
      }
    ]
  }
  // {
  //   path: 'firstpage',
  //   loadChildren: () => import('./firstpage/firstpage.module').then( m => m.FirstpagePageModule)
  // },
  // {
  //   path: 'information-user/learn',
  //   loadChildren: () => import('./information-user/learn/learn.module').then( m => m.LearnPageModule)
  // },
  // {
  //   path: 'level',
  //   loadChildren: () => import('./information-user/level/level.module').then( m => m.LevelPageModule)
  // },
  // {
  //   path: 'from',
  //   loadChildren: () => import('./information-user/from/from.module').then( m => m.FromPageModule)
  // },
  // {
  //   path: 'why',
  //   loadChildren: () => import('./information-user/why/why.module').then( m => m.WhyPageModule)
  // },
  // {
  //   path: 'age',
  //   loadChildren: () => import('./information-user/age/age.module').then( m => m.AgePageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
