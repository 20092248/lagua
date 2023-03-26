import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FromPageRoutingModule } from './from-routing.module';

import { FromPage } from './from.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FromPageRoutingModule
  ],
  declarations: [FromPage]
})
export class FromPageModule {}
