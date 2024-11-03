import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmPaymentPageRoutingModule } from './confirm-payment-routing.module';

import { ConfirmPaymentPage } from './confirm-payment.page';
import { LottieModule } from 'ngx-lottie';
import { BarStatusComponentModule } from 'src/app/bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmPaymentPageRoutingModule,
    LottieModule,
    BarStatusComponentModule
  ],
  declarations: [ConfirmPaymentPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfirmPaymentPageModule {}
