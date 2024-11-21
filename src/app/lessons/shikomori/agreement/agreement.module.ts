import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgreementPageRoutingModule } from './agreement-routing.module';

import { AgreementPage } from './agreement.page';
import { AccordionComponentModule } from '../../accordion/accordion.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgreementPageRoutingModule,
    AccordionComponentModule
  ],
  declarations: [AgreementPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AgreementPageModule {}
