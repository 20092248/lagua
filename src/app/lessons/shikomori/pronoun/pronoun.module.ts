import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PronounPageRoutingModule } from './pronoun-routing.module';

import { PronounPage } from './pronoun.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PronounPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [PronounPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PronounPageModule {}
