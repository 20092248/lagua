import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import { LottieModule } from 'ngx-lottie';
import { BarStatusComponentModule } from 'src/app/bar-status/bar-status.module';
import { NgxPayPalModule } from 'ngx-paypal';
import { GooglePayButtonModule } from '@google-pay/button-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    LottieModule,
    BarStatusComponentModule,
    NgxPayPalModule,
    GooglePayButtonModule
  ],
  declarations: [CheckoutPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutPageModule {}
