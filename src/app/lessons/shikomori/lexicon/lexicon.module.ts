import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LexiconPageRoutingModule } from './lexicon-routing.module';

import { LexiconPage } from './lexicon.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LexiconPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [LexiconPage]
})
export class LexiconPageModule {}
