import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QcmPageRoutingModule } from './qcm-routing.module';

import { QcmPage } from './qcm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QcmPageRoutingModule
  ],
  declarations: [QcmPage]
})
export class QcmPageModule {}
