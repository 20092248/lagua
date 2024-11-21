import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NominalPageRoutingModule } from './nominal-routing.module';

import { NominalPage } from './nominal.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NominalPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [NominalPage]
})
export class NominalPageModule {}
