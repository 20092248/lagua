import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QcmPageRoutingModule } from './qcm-routing.module';

import { QcmPage } from './qcm.page';
import { CountdownComponentModule } from 'src/app/countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QcmPageRoutingModule,
    CountdownComponentModule
  ],
  declarations: [QcmPage],
  exports: [QcmPage]
})
export class QcmPageModule {}
