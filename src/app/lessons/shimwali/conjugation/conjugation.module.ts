import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConjugationPageRoutingModule } from './conjugation-routing.module';

import { ConjugationPage } from './conjugation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConjugationPageRoutingModule
  ],
  declarations: [ConjugationPage]
})
export class ConjugationPageModule {}
