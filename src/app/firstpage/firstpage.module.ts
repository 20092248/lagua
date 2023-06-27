import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstpagePageRoutingModule } from './firstpage-routing.module';

import { FirstpagePage } from './firstpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FirstpagePageRoutingModule
  ],
  declarations: [FirstpagePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstpagePageModule {}
