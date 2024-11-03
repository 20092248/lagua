import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { LottieModule } from 'ngx-lottie';
import { BarStatusComponentModule } from '../bar-status/bar-status.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    LottieModule,
    BarStatusComponentModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule { }
