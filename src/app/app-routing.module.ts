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
    loadChildren: () => import('./signin/signin.module').then( m => m.SignInPageModule)
  },
  {
    path: 'login', canActivate: [IsLoggedGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginInPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
