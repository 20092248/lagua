import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import { LottieModule } from 'ngx-lottie';
import { BarStatusComponentModule } from 'src/app/bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    LottieModule,
    BarStatusComponentModule,
  ],
  declarations: [CheckoutPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutPageModule {}
