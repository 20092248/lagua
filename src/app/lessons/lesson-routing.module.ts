import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonPage } from './lesson.page';

const routes: Routes = [
  {
    path: '',
    component: LessonPage
  },
  {
    path: 'shindzuani/accent',
    loadChildren: () => import('./shindzuani/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shindzuani/agreement',
    loadChildren: () => import('./shindzuani/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shindzuani/alphabet',
    loadChildren: () => import('./shindzuani/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shindzuani/lexicon',
    loadChildren: () => import('./shindzuani/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shindzuani/nominal',
    loadChildren: () => import('./shindzuani/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shindzuani/pronoun',
    loadChildren: () => import('./shindzuani/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shindzuani/verbal',
    loadChildren: () => import('./shindzuani/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shindzuani/conjugation',
    loadChildren: () => import('./shindzuani/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: 'shingazidza/accent',
    loadChildren: () => import('./shingazidza/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shingazidza/agreement',
    loadChildren: () => import('./shingazidza/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shingazidza/alphabet',
    loadChildren: () => import('./shingazidza/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shingazidza/lexicon',
    loadChildren: () => import('./shingazidza/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shingazidza/nominal',
    loadChildren: () => import('./shingazidza/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shingazidza/pronoun',
    loadChildren: () => import('./shingazidza/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shingazidza/verbal',
    loadChildren: () => import('./shingazidza/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shingazidza/conjugation',
    loadChildren: () => import('./shingazidza/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: 'shimaore/accent',
    loadChildren: () => import('./shimaore/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shimaore/agreement',
    loadChildren: () => import('./shimaore/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shimaore/alphabet',
    loadChildren: () => import('./shimaore/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shimaore/lexicon',
    loadChildren: () => import('./shimaore/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shimaore/nominal',
    loadChildren: () => import('./shimaore/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shimaore/pronoun',
    loadChildren: () => import('./shimaore/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shimaore/verbal',
    loadChildren: () => import('./shimaore/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shimaore/conjugation',
    loadChildren: () => import('./shimaore/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: 'shimwali/accent',
    loadChildren: () => import('./shimwali/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shimwali/agreement',
    loadChildren: () => import('./shimwali/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shimwali/alphabet',
    loadChildren: () => import('./shimwali/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shimwali/lexicon',
    loadChildren: () => import('./shimwali/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shimwali/nominal',
    loadChildren: () => import('./shimwali/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shimwali/pronoun',
    loadChildren: () => import('./shimwali/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shimwali/verbal',
    loadChildren: () => import('./shimwali/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shimwali/conjugation',
    loadChildren: () => import('./shimwali/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
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
