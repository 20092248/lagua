import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccentPageRoutingModule } from './accent-routing.module';

import { AccentPage } from './accent.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccentPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [AccentPage]
})
export class AccentPageModule {}
