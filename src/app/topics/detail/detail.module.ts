import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { BarStatusComponentModule } from 'src/app/bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    BarStatusComponentModule
  ],
  declarations: [DetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailPageModule {}
