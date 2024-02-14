import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpellPageRoutingModule } from './spell-routing.module';

import { SpellPage } from './spell.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpellPageRoutingModule
  ],
  declarations: [SpellPage]
})
export class SpellPageModule {}
