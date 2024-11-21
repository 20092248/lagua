import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerbalPageRoutingModule } from './verbal-routing.module';

import { VerbalPage } from './verbal.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerbalPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [VerbalPage]
})
export class VerbalPageModule {}
