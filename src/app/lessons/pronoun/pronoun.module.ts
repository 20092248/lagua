import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PronounPageRoutingModule } from './pronoun-routing.module';

import { PronounPage } from './pronoun.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PronounPageRoutingModule
  ],
  declarations: [PronounPage]
})
export class PronounPageModule {}
