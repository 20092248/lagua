import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonsPage } from './lessons.page';

const routes: Routes = [
  {
    path: '',
    component: LessonsPage
  },
  {
    path: 'accent',
    loadChildren: () => import('./accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'agreement',
    loadChildren: () => import('./agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'alphabet',
    loadChildren: () => import('./alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'lexicon',
    loadChildren: () => import('./lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'nominal',
    loadChildren: () => import('./nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'pronoun',
    loadChildren: () => import('./pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'verbal',
    loadChildren: () => import('./verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'conjugation',
    loadChildren: () => import('./conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: '',
    redirectTo: '/tabs/lessons',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LessonsPageRoutingModule { }
