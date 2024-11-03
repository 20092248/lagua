import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpellPageRoutingModule } from './spell-routing.module';

import { SpellPage } from './spell.page';
import { CountdownComponentModule } from 'src/app/countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpellPageRoutingModule,
    CountdownComponentModule
  ],
  declarations: [SpellPage],
  exports: [SpellPage]
})
export class SpellPageModule {}
