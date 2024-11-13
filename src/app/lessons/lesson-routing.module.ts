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
    loadChildren: () => import('./shikomori/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shindzuani/agreement',
    loadChildren: () => import('./shikomori/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shindzuani/alphabet',
    loadChildren: () => import('./shikomori/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shindzuani/lexicon',
    loadChildren: () => import('./shikomori/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shindzuani/nominal',
    loadChildren: () => import('./shikomori/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shindzuani/pronoun',
    loadChildren: () => import('./shikomori/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shindzuani/verbal',
    loadChildren: () => import('./shikomori/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shindzuani/conjugation',
    loadChildren: () => import('./shikomori/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
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
    loadChildren: () => import('./shikomori/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shimaore/agreement',
    loadChildren: () => import('./shikomori/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shimaore/alphabet',
    loadChildren: () => import('./shikomori/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shimaore/lexicon',
    loadChildren: () => import('./shikomori/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shimaore/nominal',
    loadChildren: () => import('./shikomori/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shimaore/pronoun',
    loadChildren: () => import('./shikomori/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shimaore/verbal',
    loadChildren: () => import('./shikomori/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shimaore/conjugation',
    loadChildren: () => import('./shikomori/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
  },
  {
    path: 'shimwali/accent',
    loadChildren: () => import('./shikomori/accent/accent.module').then(m => m.AccentPageModule)
  },
  {
    path: 'shimwali/agreement',
    loadChildren: () => import('./shikomori/agreement/agreement.module').then(m => m.AgreementPageModule)
  },
  {
    path: 'shimwali/alphabet',
    loadChildren: () => import('./shikomori/alphabet/alphabet.module').then(m => m.AlphabetPageModule)
  },
  {
    path: 'shimwali/lexicon',
    loadChildren: () => import('./shikomori/lexicon/lexicon.module').then(m => m.LexiconPageModule)
  },
  {
    path: 'shimwali/nominal',
    loadChildren: () => import('./shikomori/nominal/nominal.module').then(m => m.NominalPageModule)
  },
  {
    path: 'shimwali/pronoun',
    loadChildren: () => import('./shikomori/pronoun/pronoun.module').then(m => m.PronounPageModule)
  },
  {
    path: 'shimwali/verbal',
    loadChildren: () => import('./shikomori/verbal/verbal.module').then(m => m.VerbalPageModule)
  },
  {
    path: 'shimwali/conjugation',
    loadChildren: () => import('./shikomori/conjugation/conjugation.module').then(m => m.ConjugationPageModule)
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
